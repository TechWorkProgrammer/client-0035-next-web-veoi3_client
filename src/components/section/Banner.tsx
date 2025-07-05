import React from "react";
import {motion} from "framer-motion";
import {useRouter} from "next/router";

const Banner: React.FC = () => {
    const router = useRouter();
    return (
        <section
            id="about"
            className="relative py-28 lg:py-56 flex flex-col items-center justify-start bg-cover bg-no-repeat"
            style={{
                backgroundImage: "url('/assets/gif/veoi3-head.gif')",
                backgroundPosition: "top",
            }}
        >
            <motion.div
                className="relative z-10 flex flex-col items-center mx-auto text-center px-2 md:px-6"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1, ease: "easeOut"}}
            >
                <div className="w-full md:max-w-5xl lg:max-w-7xl space-y-2 md:space-y-6">
                    <h2 className="text-xl lg:text-2xl font-extrabold drop-shadow-lg mb-2 tracking-wider text-secondary-700">
                        NEW AI VIDEO TOOL WITH AUDIO
                    </h2>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-semibold text-white mb-14">
                        Veoi3:
                        <span className="text-secondary-700"> AI Video Generation with Realistic Sound</span>
                    </h1>
                    <button
                        onClick={() => router.push("/studio")}
                        className="rounded-full bg-white text-black py-1.5 px-5 font-semibold text-sm md:text-md lg:text-lg"
                    >
                        Start Creating Now
                    </button>
                </div>
            </motion.div>

            <div className="absolute inset-0 bg-black opacity-70" />
        </section>
    );
};

export default Banner;
