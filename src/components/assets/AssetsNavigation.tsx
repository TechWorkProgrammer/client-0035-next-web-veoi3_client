import React from "react";
import {useRouter} from "next/router";

interface AssetsNavigationProps {
    activeCategory: "mesh" | "music" | "code" | "metaverse" | "game" | "nft";
}

const AssetsNavigation: React.FC<AssetsNavigationProps> = ({activeCategory}) => {
    const router = useRouter();

    return (
        <div className="relative mb-8 flex flex-row items-center space-y-4">
            <div className="flex items-center justify-center rounded-full shadow-md w-fit">
                <button
                    onClick={() => router.push("/assets/3d")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "mesh"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    3D Models
                </button>

                <button
                    onClick={() => router.push("/assets/music")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "music"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    Music
                </button>

                <button
                    onClick={() => router.push("/assets/code")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "code"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    Code
                </button>

                <button
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "metaverse"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    Metaverse
                </button>

                <button
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "game"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    Game
                </button>

                <button
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition text-lg text-white ${
                        activeCategory === "nft"
                            ? "border-b border-accent-500"
                            : ""
                    }`}
                >
                    NFT
                </button>
            </div>
        </div>
    );
};

export default AssetsNavigation;
