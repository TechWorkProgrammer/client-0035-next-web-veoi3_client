import React from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import {FaArrowRight} from "react-icons/fa";

interface AssetCardProps {
    title: string;
    path: string;
    image: string;
    description: string;
}

const AssetCard: React.FC<AssetCardProps> = ({title, path, image, description}) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(path)}
            className="cursor-pointer group relative bg-primary-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2"
        >
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{objectFit: "cover"}}
                    className="transition-transform duration-500 opacity-80"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-500"></div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                    {title}
                </h3>
                <p className="text-sm text-secondary-300 mb-4">
                    {description}
                </p>
                <div className="flex items-center text-accent-400 font-medium">
                    Check my {title} Assets <FaArrowRight className="ml-2"/>
                </div>
            </div>
        </div>
    );
};

export default AssetCard;
