import React, {useState} from 'react';
import Image from 'next/image';
import {FaPlay} from 'react-icons/fa';
import VideoModal from "@/components/gallery/VideoModal";

export interface Video {
    id: string;
    prompt: string;
    videoFiles: {
        videoUrl: string;
        thumbnailUrl?: string | null;
    }[];
    _count: {
        favorites: number;
    };
}

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({video}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const thumbnailUrl = video.videoFiles?.[0]?.thumbnailUrl;
    const videoUrl = video.videoFiles?.[0]?.videoUrl;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="relative aspect-video bg-black overflow-hidden group cursor-pointer shadow-lg"
                onClick={openModal}
            >
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={video.prompt}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <video
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}

                <div
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FaPlay className="text-white text-4xl"/>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-semibold truncate" title={video.prompt}>
                        {video.prompt}
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <VideoModal video={video} onClose={closeModal}/>
            )}
        </>
    );
};

export default VideoCard;