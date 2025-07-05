import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";

const steps = [
    {
        title: "1. SIGN UP OR LOG IN",
        description: "Create an account or log in to access Veoi3.",
        className: "row-span-2",
    },
    {
        title: "2. ENTER YOUR PROMPT",
        description:
            "Type a text description or upload images to describe the video you want.",
        className: "col-span-2",
    },
    {
        title: "3. CUSTOMIZE AUDIO",
        description:
            "Add instructions for sound effects, dialogue, or ambient noise to enhance your video.",
        className: "",
    },
    {
        title: "4. GENERATE AND REVIEW",
        description:
            "Let Veoi3 create your video, then preview and download your AI-generated clip.",
        className: "",
    },
];

const HowItWorksSection: React.FC = () => {
    return (
        <section
            id="how-it-works"
            className="relative flex flex-col items-center justify-start w-full py-20 px-4 text-white bg-transparent z-20"
        >
            <div className="z-20">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold my-4 text-white text-center max-w-5xl"
                    initial={{opacity: 0, y: -10}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, delay: 0.1}}
                >
                    How to Create AI Videos with Veoi3
                </motion.h1>
                <motion.h5
                    className="text-xl font-bold mb-12 text-secondary-600 text-center z-10"
                >
                    Follow these simple steps to generate videos with synchronized audio using Veoi3.
                </motion.h5>

                <div className="grid grid-cols-3 grid-rows-2 gap-2 md:gap-6 mt-16 max-w-7xl w-full">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className={`bg-background-dark p-6 rounded-xl shadow-md flex flex-col justify-between gap-8 ${step.className}`}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: false}}
                            transition={{duration: 0.5, delay: idx * 0.2}}
                        >
                            <h3 className="text-xs md:text-md font-semibold text-white mb-2 tracking-widest uppercase">
                                {step.title}
                            </h3>
                            <p className="text-xs md:text-sm lg:text-md font-semibold text-white">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="absolute w-full flex justify-center items-center h-auto z-10 -bottom-1/3">
                <motion.div
                    className="w-full transform rotate-3 scale-105 border-accent-500"
                    initial={{opacity: 0, scale: 0.9}}
                    whileInView={{opacity: 1, scale: 1}}
                    viewport={{once: false}}
                    transition={{duration: 0.8}}
                >
                    <Image
                        src="/assets/images/bg-bottom-howitworks.png"
                        alt="how-it-works-bottom-bg"
                        width={3840}
                        height={2160}
                        className="object-cover w-full h-auto"
                        priority
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
