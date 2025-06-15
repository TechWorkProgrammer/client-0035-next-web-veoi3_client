import React from "react";
import Banner from "@/components/section/Banner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlanSection from "@/components/section/PlanSection";
import ProjectSection from "@/components/section/ProjectSection";
import HowItWorksSection from "@/components/section/HowItWorksSection";
import FeatureSection from "@/components/section/FutureSection";

const Home: React.FC = () => {
    return (
        <>
            <Header/>
            <main className="flex-grow subpixel-antialiased mb-24">
                <Banner/>
                <FeatureSection/>
                <HowItWorksSection/>
                <PlanSection/>
                <ProjectSection/>
            </main>
            <Footer/>
        </>
    );
};

export default Home;
