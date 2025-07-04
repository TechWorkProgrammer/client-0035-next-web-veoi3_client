import React, {useState} from 'react';
import Image from 'next/image';
import {FaPlay} from 'react-icons/fa';
import VideoModal,{Video} from '@/components/gallery/VideoModal';

interface ExploreVideoCardProps {
    video: Video;
}

const ExploreVideoCard: React.FC<ExploreVideoCardProps> = ({video}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const thumbnailUrl = video.videoFiles?.[0]?.thumbnailUrl;
    const videoUrl = video.videoFiles?.[0]?.videoUrl;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="relative bg-black rounded overflow-hidden group cursor-pointer shadow-lg break-inside-avoid mb-4"
                onClick={openModal}
            >
                <div className="w-full h-auto">
                    {thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt={video.prompt}
                            width={500}
                            height={500 * (9 / 16)}
                            layout="responsive"
                            objectFit="cover"
                            className="w-full h-auto"
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-auto"
                        />
                    )}
                </div>

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

            {isModalOpen && <VideoModal video={video} onClose={closeModal}/>}
        </>
    );
};

export default ExploreVideoCard;