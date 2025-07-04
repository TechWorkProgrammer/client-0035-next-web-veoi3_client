import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/router";

const Banner: React.FC = () => {
    const router = useRouter();
    return (
        <section id="about"
                 className="relative pt-24 lg:pt-44 flex flex-col items-center justify-start"
        >
            <motion.div
                className="relative z-10 flex flex-col items-center mx-auto overflow-hidden"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1, ease: "easeOut"}}
            >
                <div className="w-full md:max-w-5xl lg:max-w-7xl text-center space-y-2 md:space-y-6 px-2 md:px-6">
                    <h2 className="text-xl lg:text-2xl font-extrabold text-center drop-shadow-lg mb-2 tracking-wider text-secondary-400">
                        NEW AI VIDEO TOOL WITH AUDIO
                    </h2>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-semibold text-white text-center mb-14">
                        Veoi3:
                        <span
                            className="text-secondary-400 text-center">
                            {" "}AI Video Generation with Realistic Sound
                        </span>
                    </h1>

                    <button
                        onClick={() => router.push("/studio")}
                        className="rounded-full bg-white text-black py-1.5 px-5 font-semibold text-sm md:text-md lg:text-lg"
                    >
                        Start Creating Now
                    </button>
                </div>
                {/*<div className="relative flex justify-center items-center w-full h-[160px] mt-10 z-0">
                    <motion.div
                        className="absolute w-[90%] aspect-square rounded-full bg-gradient-to-r from-white to-accent-500 -top-10 blur-2xl"
                        initial={{opacity: 0, scale: 0.8}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: false}}
                        transition={{duration: 0.8}}
                    />
                    <motion.div
                        className="absolute w-[70%] aspect-square rounded-full bg-black top-0 z-10"
                        initial={{opacity: 0, scale: 0.9}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: false}}
                        transition={{duration: 0.8, delay: 0.2}}
                    />
                </div>*/}
                <div
                    className="relative w-[360px] md:w-[1080px] aspect-[16/9] rounded overflow-hidden shadow-lg mx-auto mt-8">
                    <Image
                        src="/assets/gif/veoi3-head.gif"
                        alt="Generated Example"
                        fill
                        style={{objectFit: "cover", objectPosition: "top"}}
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Banner;
