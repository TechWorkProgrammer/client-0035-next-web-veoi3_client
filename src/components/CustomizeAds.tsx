import React from 'react';
import Image from 'next/image';
import {useAlert} from "@/context/Alert";

const CustomizeAds: React.FC = () => {
    const alert = useAlert();

    const handleLogicAIClick = () => {
        alert('Coming Soon', 'info');
    };

    return (
        <div
            className={`flex flex-col space-y-6 p-6 text-white lg:rounded-lg max-w-7xl mx-auto w-full`}>
            <div className="bg-primary text-white">
                <h2 className="font-semibold mb-4 text-start">Customize your 3D model:</h2>
                <div className="flex flex-wrap justify-start items-center gap-4">
                    <button
                        className="bg-secondary text-white py-2 px-4 rounded-md flex items-center justify-center"
                        onClick={handleLogicAIClick}
                    >
                        <div className="relative w-24 h-10">
                            <Image
                                src="/horizontal-white.png"
                                alt="LOGIC.AI"
                                fill
                                sizes="(max-width: 768px) 50vw, 120px"
                                style={{objectFit: 'contain'}}
                                priority
                            />
                        </div>
                    </button>

                    <a href="https://stephaneginier.com/sculptgl/" target="_blank" rel="noopener noreferrer">
                        <button
                            className="bg-secondary text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
                            <div className="relative w-6 h-6">
                                <Image
                                    src="/assets/image/sthepane.png"
                                    alt="SculptGL"
                                    fill
                                    sizes="(max-width: 768px) 10vw, 24px"
                                    style={{objectFit: 'contain'}}
                                />
                            </div>
                            Sculptgl
                        </button>
                    </a>

                    <a href="https://vectary.com" target="_blank" rel="noopener noreferrer">
                        <button
                            className="bg-secondary text-white py-2 px-4 rounded-md flex items-center justify-center">
                            <div className="relative w-24 h-10">
                                <Image
                                    src="/assets/image/vectary.svg"
                                    alt="VECTARY"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 120px"
                                    style={{objectFit: 'contain'}}
                                />
                            </div>
                        </button>
                    </a>

                    <a href="https://www.tinkercad.com/" target="_blank" rel="noopener noreferrer">
                        <button
                            className="bg-secondary text-white py-2 px-4 rounded-md flex items-center justify-center">
                            <div className="relative w-24 h-10">
                                <Image
                                    src="/assets/image/tinkercard.svg"
                                    alt="TINKERCAD"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 120px"
                                    style={{objectFit: 'contain'}}
                                />
                            </div>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CustomizeAds;
