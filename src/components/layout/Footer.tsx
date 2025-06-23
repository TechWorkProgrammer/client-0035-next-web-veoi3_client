import React from "react";
import {FaMedium, FaXTwitter} from "react-icons/fa6";
import {RiTelegram2Fill} from "react-icons/ri";
import {useRouter} from "next/router";

const Footer: React.FC = () => {
    const router = useRouter();
    return (
        <footer className="relative w-full text-secondary py-10 bg-transparent">
            <div className="container mx-auto px-4 lg:px-16 z-2">
                <div className="flex flex-col justify-between items-center gap-4">
                    <div className="text-center flex flex-col gap-3">
                        <h1 className="text-5xl text-white">
                            Veoi3
                        </h1>
                        <p className="text-lg text-secondary-500">
                            Get everything you need to make creative videos quickly and effortlessly
                        </p>
                    </div>
                    <div className="flex gap-4 my-6">
                        <a href="https://t.me/Veoi3/" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-400 hover:text-accent-500 transition">
                            <RiTelegram2Fill size={24}/>
                        </a>
                        <a href="https://x.com/veoi3official/" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-400 hover:text-accent-500 transition">
                            <FaXTwitter size={24}/>
                        </a>
                        <a href="https://medium.com/" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-400 hover:text-accent-500 transition">
                            <FaMedium size={24}/>
                        </a>
                    </div>
                </div>
                <div
                    className="my-6 border-t border-secondary-700 py-4 md:pt-12 text-center flex flex-row justify-center gap-3">
                    <p className="text-md text-secondary-500">
                        © 2025 Veoi3.
                    </p>
                    <p
                        className="text-md text-secondary-500 cursor-pointer hover:underline"
                        onClick={() => router.push("/terms-of-service")}
                    >
                        Terms of Service
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;