import React from "react";
import Banner from "@/components/section/Banner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlanSection from "@/components/section/PlanSection";
import ProjectSection from "@/components/section/ProjectSection";
import HowItWorksSection from "@/components/section/HowItWorksSection";
import FeatureSection from "@/components/section/FutureSection";
import Image from "next/image";

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden w-screen">
            <Header/>
            <main className="flex-grow subpixel-antialiased w-screen">
                <Banner/>
                <div className="relative">
                    <div className="absolute w-full flex justify-center items-center h-full z-10 -top-1/4">
                        <Image
                            src="/assets/images/bg-key-feature.png"
                            alt="how-it-works-bottom-bg"
                            width={2000}
                            height={4000}
                            className="object-fill w-full h-auto"
                            priority
                        />
                    </div>
                    <FeatureSection/>
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
