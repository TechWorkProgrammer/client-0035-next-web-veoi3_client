import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {
    FaCompress,
    FaDownload,
    FaExpand,
    FaEye,
    FaHeart,
    FaPause,
    FaPlay,
    FaTimes,
    FaVolumeMute,
    FaVolumeUp,
    FaStar,
} from 'react-icons/fa';
import {FiHeart, FiStar} from 'react-icons/fi';
import api from '@/utils/axios';
import {useAlert} from '@/context/Alert';
import {getAccessToken} from '@/utils/user';

export interface Video {
    id: string;
    prompt: string;
    videoFiles?: {
        videoUrl: string;
        thumbnailUrl: string;
    }[];
    views?: number;
    _count?: {
        favorites: number;
    };
}

interface VideoModalProps {
    video: Video;
    onClose: () => void;
    isGallery?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({
                                                   video,
                                                   onClose,
                                                   isGallery = false,
                                               }) => {
    const isAuthenticated = !!getAccessToken();
    const videoUrl = video.videoFiles?.[0]?.videoUrl;
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isFavorited, setIsFavorited] = useState(false);
    const [isGalleryFavorited, setIsGalleryFavorited] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(
        video._count?.favorites ?? 0
    );
    const [viewCount, setViewCount] = useState(video.views ?? 0);
    const [isLoading, setIsLoading] = useState(true);

    const alert = useAlert();

    useEffect(() => {
        const initializeModal = async () => {
            setViewCount((v) => v + 1);
            api.post(`/video/${video.id}/view`).catch(() => {
                setViewCount((v) => v - 1);
            });

            if (isAuthenticated) {
                setIsLoading(true);
                try {
                    const res = await api.get(`/video/${video.id}/details`);
                    const {
                        isFavorited: favStatus,
                        isGalleryFavorite: galStatus,
                        favoriteCount: favCount,
                    } = res.data.data;
                    setIsFavorited(favStatus);
                    setIsGalleryFavorited(galStatus);
                    setFavoriteCount(favCount);
                } catch (e) {
                    console.error('Failed to fetch video details:', e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        initializeModal().then();
    }, [video.id, isAuthenticated]);

    const handleToggleFavorite = async (
        type: 'DEFAULT' | 'GALLERY' = 'DEFAULT'
    ) => {
        if (!isAuthenticated) {
            alert(
                'Login Required',
                'Please connect your wallet to favorite this video.',
                'info'
            );
            return;
        }

        if (type === 'DEFAULT') {
            setIsFavorited((p) => !p);
            setFavoriteCount((c) => (isFavorited ? c - 1 : c + 1));
        } else {
            setIsGalleryFavorited((p) => !p);
        }

        try {
            await api.post(`/video/${video.id}/like`, {type});
        } catch (error: any) {
            alert('Failed to toggle favorite', error.message, 'error');
            if (type === 'DEFAULT') {
                setIsFavorited((p) => !p);
                setFavoriteCount((c) => (isFavorited ? c + 1 : c - 1));
            } else {
                setIsGalleryFavorited((p) => !p);
            }
        }
    };

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play().catch(console.error);
        setIsPlaying((p) => !p);
    }, [isPlaying]);

    const toggleFullscreen = useCallback(() => {
        if (!videoRef.current) return;
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === videoRef.current);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'f') toggleFullscreen();
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
    }, [onClose, toggleFullscreen, togglePlay]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) onClose();
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || !isFinite(videoRef.current.duration)) return;
        const curr = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        setCurrentTime(curr);
        setDuration(dur);
        setProgress((curr / dur) * 100);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current || !isFinite(duration)) return;
        const val = Number(e.target.value);
        videoRef.current.currentTime = (val / 100) * duration;
        setProgress(val);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const downloadFileName = `${video.prompt
        .slice(0, 30)
        .replace(/\s+/g, '_')}_${video.id.slice(0, 4)}.mp4`;

    const modalContent = (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 w-screen h-screen"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-white rounded-full p-1 md:p-2 z-20 hover:bg-white hover:text-black transition"
                    title="Close (Esc)"
                >
                    <FaTimes className="w-5 h-5"/>
                </button>

                <div className="absolute top-4 right-4 flex justify-around items-center gap-3 z-20">
                    <div className="text-white rounded-full p-1 md:p-2 flex items-center gap-2">
                        <FaEye className="w-3 h-3 md:w-5 md:h-5"/>
                        <span className="text-xs font-bold pr-1">
                          {viewCount.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => handleToggleFavorite('DEFAULT')}
                        disabled={isLoading && isAuthenticated}
                        className="text-white rounded-full p-1 md:p-2 hover:bg-white hover:text-black transition flex items-center gap-2 disabled:opacity-50"
                        title={isFavorited ? 'Unlike' : 'Like'}
                    >
                        {isFavorited ? (
                            <FaHeart className="text-red-500 w-3 h-3 md:w-5 md:h-5"/>
                        ) : (
                            <FiHeart className="w-3 h-3 md:w-5 md:h-5"/>
                        )}
                        <span className="text-xs font-bold">
                          {favoriteCount.toLocaleString()}
                        </span>
                    </button>

                    {isGallery && (
                        <button
                            onClick={() => handleToggleFavorite('GALLERY')}
                            disabled={isLoading && isAuthenticated}
                            className="text-white rounded-full p-1 md:p-2 hover:bg-white hover:text-black transition flex items-center gap-2 disabled:opacity-50"
                            title={isGalleryFavorited ? 'Remove gallery-fav' : 'Add to gallery-fav'}
                        >
                            {isGalleryFavorited ? (
                                <FaStar className="w-3 h-3 md:w-5 md:h-5"/>
                            ) : (
                                <FiStar className="w-3 h-3 md:w-5 md:h-5"/>
                            )}
                        </button>
                    )}

                    <button
                        onClick={toggleMute}
                        className="text-white rounded-full p-1 md:p-2 hover:bg-white hover:text-black transition"
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? (
                            <FaVolumeMute className="w-3 h-3 md:w-5 md:h-5"/>
                        ) : (
                            <FaVolumeUp className="w-3 h-3 md:w-5 md:h-5"/>
                        )}
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="text-white rounded-full p-1 md:p-2 hover:bg-white hover:text-black transition"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? (
                            <FaCompress className="w-3 h-3 md:w-5 md:h-5"/>
                        ) : (
                            <FaExpand className="w-3 h-3 md:w-5 md:h-5"/>
                        )}
                    </button>
                    <a
                        href={videoUrl}
                        download={downloadFileName}
                        className="text-white rounded-full p-1 md:p-2 hover:bg-white hover:text-black transition"
                        title="Download"
                    >
                        <FaDownload className="w-3 h-3 md:w-5 md:h-5"/>
                    </a>
                </div>

                <div className="relative w-full h-full flex items-center justify-center max-w-4xl max-h-[70vh]">
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

                <div className="md:px-6 flex flex-col items-center max-w-7xl mx-auto w-full pt-2">
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
                        <span>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>
                    <div className="relative p-4 text-center">
                        <p className="text-white text-xs md:text-sm mx-auto max-w-7xl">
                            {video.prompt}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default VideoModal;
