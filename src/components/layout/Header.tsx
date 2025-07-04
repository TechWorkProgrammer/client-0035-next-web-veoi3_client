import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!isNavOpen) {
                setIsScrolled(window.scrollY > 50);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isNavOpen]);

    useEffect(() => {
        document.body.style.overflow = isNavOpen ? "hidden" : "";
    }, [isNavOpen]);

    const navItems = [
        {label: "About", path: "#about"},
        {label: "Features", path: "#features"},
        {label: "How it works", path: "#how-it-works"},
        {label: "Pricing", path: "#pricing"},
        {label: "Documentation", path: "https://docs.veoi3.app/"},
    ];

    const handleNavigation = (path: string) => {
        setIsNavOpen(false);
        if (!path.startsWith("#")) {
            router.push(path).then();
        }
    };

    const headerBg = isNavOpen
        ? "bg-primary-900 shadow-lg"
        : isScrolled
            ? "bg-primary-900 bg-opacity-90 shadow-lg"
            : "bg-transparent";

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-screen z-40 transition-all duration-300 ${headerBg}`}
            >
                <nav className="px-4 lg:px-10 py-3">
                    <div className="flex justify-between items-center max-w-screen-2xl mx-auto relative">
                        <div className="flex flex-row justify-between items-center gap-8">
                            <button
                                onClick={() => router.push("/")}
                                className="flex items-center space-x-2 w-auto h-8"
                            >
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/icon.png"
                                        alt="VeoI3 Logo"
                                        fill
                                        sizes="(max-width: 768px) 32px, (max-width: 1200px) 40px, 48px"
                                        style={{objectFit: "contain"}}
                                        priority
                                    />
                                </div>
                                <span className="text-white font-semibold text-xl md:text-2xl">
                                Veoi3
                            </span>
                            </button>

                            <ul className="space-x-2 md:space-x-6 hidden md:flex">
                                {navItems.map((item) => (
                                    <li key={item.label}>
                                        {item.path.startsWith("http") ? (
                                            <a
                                                href={item.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/70 font-semibold text-sm md:text-lg hover:text-accent-500 transition-colors"
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className="text-white/70 font-semibold text-sm md:text-lg hover:text-accent-500 transition-colors"
                                                onClick={() => handleNavigation(item.path)}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className="rounded-full bg-secondary-700 text-white py-1 px-4 font-semibold text-sm md:text-md lg:text-lg bg-opacity-50"
                            onClick={() => router.push("/explore")}>
                            Get Access
                        </button>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
