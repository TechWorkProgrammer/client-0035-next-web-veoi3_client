import React from "react";
import Image from "next/image";

const TermsBanner: React.FC = () => {
    return (
        <section
            className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center text-white overflow-hidden rounded-b-3xl">
            <Image
                src="/assets/images/termsofservice.png"
                alt="Terms of Service"
                fill
                className="object-cover brightness-[0.4]"
                priority
            />

            <div className="relative z-10 text-center px-4 max-w-3xl text-white">
                <p className="text-sm mb-2">Last updated: June 2025</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">Terms of Service</h1>
                <p className="text-sm md:text-base">
                    By using Veoi3, you agree to these terms. Please read carefully before proceeding.
                </p>
            </div>
        </section>
    );
};

export default TermsBanner;
