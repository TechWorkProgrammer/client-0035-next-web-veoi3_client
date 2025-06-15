import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/router";
import ScrollingFeatures from "@/components/common/ScrollingFeatures";

const ProjectSection = () => {
    const router = useRouter();

    return (
        <motion.section
            id="project"
            className="relative flex flex-col items-center justify-start min-h-screen text-white py-16 bg-transparent overflow-visible"
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: false}}
            transition={{duration: 1}}
        >
            <div className="absolute inset-0 z-0"></div>

            <motion.h5
                className="text-xl font-bold text-secondary-600 text-center z-10 tracking-widest"
            >
                UNLEASH YOUR CREATIVE VISION
            </motion.h5>
            <motion.h1
                className="text-4xl md:text-5xl font-bold my-4 text-white text-center z-10"
            >
                Experience a New Era of Video Creation with Veoi3.
            </motion.h1>
            <motion.h5
                className="text-xl font-bold mb-12 text-secondary-600 text-center z-10"
            >
                The cutting-edge generative AI video that produces integrated visuals and audio, straight from your
                imagination.
            </motion.h5>

            <button
                onClick={() => router.push("/studio")}
                className="rounded-full bg-white text-black py-1.5 px-5 font-semibold text-sm md:text-md lg:text-lg"
            >
                Start your first project
            </button>

            <div className="py-8 max-w-4xl">
                <ScrollingFeatures/>
            </div>


            <div className="relative w-full flex justify-center items-center w-full h-auto z-10">
                <motion.div
                    className="relative w-full transform rotate-3 scale-105 border-accent-500"
                    initial={{opacity: 0, scale: 0.9}}
                    whileInView={{opacity: 1, scale: 1}}
                    viewport={{once: false}}
                    transition={{duration: 0.8}}
                >
                    <Image
                        src="/assets/images/project.png"
                        alt="3D Creation"
                        width={3840}
                        height={2160}
                        className="object-cover w-full h-auto"
                        priority
                    />
                </motion.div>
            </div>
        </motion.section>
    );
};

export default ProjectSection;
