import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/router";

const Banner: React.FC = () => {
    const router = useRouter();
    return (
        <section id="about"
                 className="relative pt-24 lg:pt-44 flex flex-col items-center justify-start overflow-hidden"
        >
            <motion.div
                className="relative z-10 flex flex-col items-center mx-auto"
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1, ease: "easeOut"}}
            >
                <div className="w-full md:max-w-lg lg:max-w-5xl text-center space-y-2 md:space-y-6 px-2 md:px-6">
                    <h2 className="text-xl md:text-2xl font-extrabold text-center drop-shadow-lg mb-2 tracking-wider text-secondary-400">
                        NEW AI VIDEO TOOL WITH AUDIO
                    </h2>
                    <h1 className="text-3xl md:text-7xl font-semibold text-white text-center mb-14">
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
                <div className="relative flex justify-center items-center w-full h-[180px] mt-10 z-0">
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
                </div>
                <div
                    className="relative w-[90vw] md:w-[95vw] aspect-[20/9] rounded-xl overflow-hidden shadow-lg mx-auto">
                    <Image
                        src="/assets/images/banner.png"
                        alt="Generated Example"
                        width={4428}
                        height={2744}
                        style={{objectFit: "cover", objectPosition: "center"}}
                        priority
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Banner;
