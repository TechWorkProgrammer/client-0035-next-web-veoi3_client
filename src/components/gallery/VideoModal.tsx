import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {FaCompress, FaDownload, FaExpand, FaPause, FaPlay, FaTimes, FaVolumeMute, FaVolumeUp} from 'react-icons/fa';

interface Video {
    id: string;
    prompt: string;
    videoFiles: {
        videoUrl: string;
    }[];
}

interface VideoModalProps {
    video: Video;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({video, onClose}) => {
    const videoUrl = video.videoFiles?.[0]?.videoUrl;
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'f' && videoRef.current) toggleFullscreen();
            if (event.key === ' ') {
                event.preventDefault();
                togglePlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) onClose();
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play().then();
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!modalRef.current) return;
        if (!isFullscreen) {
            modalRef.current.requestFullscreen()?.then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen()?.then(() => setIsFullscreen(false));
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const curr = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        setCurrentTime(curr);
        setDuration(dur);
        setProgress((curr / dur) * 100);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = Number(e.target.value) / 100 * duration;
        setProgress(Number(e.target.value));
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const downloadFileName = `${video.prompt.slice(0, 30).replace(/\s+/g, '_')}_${video.id.slice(0, 4)}.mp4`;

    const modalContent = (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 w-screen h-screen"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 z-20 hover:bg-white hover:text-black transition"
                    title="Close (Esc)"
                >
                    <FaTimes size={20}/>
                </button>

                <div className="absolute top-4 right-4 flex gap-3 z-20">
                    <button
                        onClick={toggleMute}
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-white hover:text-black transition"
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <FaVolumeMute size={18}/> : <FaVolumeUp size={18}/>}
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-white hover:text-black transition"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <FaCompress size={18}/> : <FaExpand size={18}/>}
                    </button>
                    <a
                        href={videoUrl}
                        download={downloadFileName}
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-white hover:text-black transition"
                        title="Download"
                    >
                        <FaDownload size={18}/>
                    </a>
                </div>

                <div className="relative w-full h-full flex items-center justify-center max-w-3xl">
                    {videoUrl ? (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-full object-contain"
                            onClick={togglePlay}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleTimeUpdate}
                            muted={isMuted}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-500">
                            Video not available.
                        </div>
                    )}
                </div>

                <div className="px-6 flex flex-col items-center max-w-5xl mx-auto">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 appearance-none bg-white/20 rounded-full outline-none transition-all
                                 [&::-webkit-slider-thumb]:appearance-none
                                 [&::-webkit-slider-thumb]:h-3
                                 [&::-webkit-slider-thumb]:w-3
                                 [&::-webkit-slider-thumb]:rounded-full
                                 [&::-webkit-slider-thumb]:bg-white
                                 [&::-webkit-slider-thumb]:shadow-md
                                 [&::-webkit-slider-thumb]:transition"
                    />
                    <div className="mt-2 flex items-center justify-between w-full text-white text-xs">
                        <button onClick={togglePlay} className="p-2 hover:opacity-80 transition">
                            {isPlaying ? <FaPause size={12}/> : <FaPlay size={12}/>}
                        </button>
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                    <div
                        className="relative bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
                        <p className="text-white text-sm mx-auto max-w-5xl">{video.prompt}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default VideoModal;
