import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TermsBanner from "@/components/section/TermsBanner";
import TermsContent from "@/components/section/TermsContent";

const TermsOfService: React.FC = () => {
    return (
        <>
            <Header/>
            <main className="flex-grow subpixel-antialiased mb-24">
                <TermsBanner/>
                <TermsContent/>
            </main>
            <Footer/>
        </>
    );
};

export default TermsOfService;
