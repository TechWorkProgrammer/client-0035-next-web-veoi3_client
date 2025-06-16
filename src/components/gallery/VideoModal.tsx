import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import {FaDownload, FaTimes} from 'react-icons/fa';

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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && event.target === modalRef.current) {
            onClose();
        }
    };

    const downloadFileName = `${video.prompt.slice(0, 30).replace(/ /g, '_')}_${video.id.slice(0, 4)}.mp4`;

    const modalContent = (
        <div
            ref={modalRef}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 lg:p-8 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full h-full max-w-7xl flex items-center justify-center">

                <button
                    onClick={onClose}
                    className="absolute top-0 left-0 m-2 md:m-4 bg-black/50 text-white rounded-full p-3 z-20 transition hover:bg-white hover:text-black"
                    title="Close (Esc)"
                >
                    <FaTimes size={20}/>
                </button>

                <a
                    href={videoUrl}
                    download={downloadFileName}
                    className="absolute top-0 right-0 m-2 md:m-4 bg-black/50 text-white rounded-full p-3 z-20 transition hover:bg-white hover:text-black"
                    title="Download video"
                >
                    <FaDownload size={20}/>
                </a>

                <div className="w-full h-full flex items-center justify-center animate-scaleIn">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            loop
                            className="w-full h-auto max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-500">
                            Video not available.
                        </div>
                    )}
                </div>

                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="text-white text-base md:text-lg max-w-4xl mx-auto">{video.prompt}</p>
                </div>

            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default VideoModal;