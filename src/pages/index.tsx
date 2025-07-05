import React from "react";
import Banner from "@/components/section/Banner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlanSection from "@/components/section/PlanSection";
import ProjectSection from "@/components/section/ProjectSection";
import HowItWorksSection from "@/components/section/HowItWorksSection";
import FeatureSection from "@/components/section/FutureSection";
import {motion} from "framer-motion";
import Image from "next/image";

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden w-screen">
            <Header/>
            <main className="flex-grow subpixel-antialiased w-screen">
                <Banner/>
                <div className="relative">
                    <FeatureSection/>
                    <div className="absolute w-full flex justify-center items-center h-full z-10 -top-1/4">
                        <motion.div
                            className="w-full transform rotate-3 scale-105 border-accent-500 h-full"
                            initial={{opacity: 0, scale: 0.9}}
                            whileInView={{opacity: 1, scale: 1}}
                            viewport={{once: false}}
                            transition={{duration: 0.8}}
                        >
                            <Image
                                src="/assets/images/bg-key-feature.png"
                                alt="how-it-works-bottom-bg"
                                width={3840}
                                height={3840}
                                className="object-fill w-full h-auto"
                                priority
                            />
                        </motion.div>
                    </div>
                    <HowItWorksSection/>
                </div>
                <PlanSection/>
                <ProjectSection/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
