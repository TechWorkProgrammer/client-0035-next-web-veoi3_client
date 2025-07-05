import React from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {FaHeadphones, FaImages, FaUser, FaLink, FaCube, FaServer, FaPlay} from "react-icons/fa";

const featuresLeft = [
    {
        icon: <FaHeadphones className="w-5 h-5"/>,
        title: "Native Audio Generation",
        desc: "Automatically add sound effects, ambient noises, and dialogue to your videos.",
    },
    {
        icon: <FaImages className="w-5 h-5"/>,
        title: "Multi-Input Prompts",
        desc: "Generate videos using text descriptions or image references.",
    },
    {
        icon: <FaUser className="w-5 h-5"/>,
        title: "Realistic Lip Sync",
        desc: "AI matches character speech perfectly with mouth movements for lifelike results.",
    },
];

const featuresRight = [
    {
        icon: <FaLink className="w-5 h-5"/>,
        title: "Integration with Flow App",
        desc: "Easily create cinematic clips by combining Veoi3 with Google's Flow video editor.",
    },
    {
        icon: <FaCube className="w-5 h-5"/>,
        title: "Physics-Based Video Simulation",
        desc: "Videos reflect real-world physics for natural motion and visuals.",
    },
    {
        icon: <FaServer className="w-5 h-5"/>,
        title: "Available on Vertex AI",
        desc: "Enterprise users can access Veoi3 via Google’s Vertex AI platform for scalable video generation.",
    },
];

const FeatureSection: React.FC = () => {
    return (
        <section
            id="features"
            className="relative flex flex-col w-full py-20 text-white my-20"
        >
            <div className="z-20 flex flex-col items-center justify-start w-full">
                <motion.h5
                    className="text-sm font-semibold text-secondary-600 text-center tracking-widest uppercase"
                    initial={{opacity: 0, y: -20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: false}}
                    transition={{duration: 0.6}}
                >
                    Features
                </motion.h5>
                <motion.h1
                    className="text-4xl md:text-5xl font-bold my-4 text-white text-center max-w-6xl"
                    initial={{opacity: 0, y: -10}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: false}}
                    transition={{duration: 0.6, delay: 0.1}}
                >
                    Key Features of Veoi3 AI Video Generator
                </motion.h1>
                <motion.p
                    className="text-secondary-400 max-w-2xl text-center text-sm md:text-base"
                    initial={{opacity: 0, y: 10}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: false}}
                    transition={{duration: 0.6, delay: 0.2}}
                >
                    Veoi3 combines cutting-edge AI tech to deliver video and audio generation in one seamless tool.
                </motion.p>

                <div className="grid grid-cols-3 gap-10 mt-16 w-full max-w-7xl items-center">
                    <div className="space-y-14">
                        {featuresLeft.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col items-start gap-2"
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: false}}
                                transition={{duration: 0.4, delay: idx * 0.1}}
                            >
                                <div className="bg-background-dark rounded-lg p-2">
                                    <div className="text-white w-5 h-5">{feature.icon}</div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm md:text-base">{feature.title}</h3>
                                    <p className="text-sm text-secondary-400">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="relative w-full h-[560px] rounded-2xl overflow-hidden shadow-xl"
                        initial={{opacity: 0, scale: 0.95}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: false}}
                        transition={{duration: 0.6}}
                    >
                        <Image
                            src="/assets/images/feature.png"
                            alt="Feature Preview"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 flex justify-center items-center z-10">
                            <FaPlay className="text-white w-10 h-10 hover:scale-110 transition-transform duration-200"/>
                        </div>
                    </motion.div>

                    <div className="space-y-14">
                        {featuresRight.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col items-start gap-2"
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: false}}
                                transition={{duration: 0.4, delay: idx * 0.1}}
                            >
                                <div className="bg-background-dark rounded-lg p-2">
                                    <div className="text-white w-5 h-5">{feature.icon}</div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm md:text-base">{feature.title}</h3>
                                    <p className="text-sm text-secondary-400">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
