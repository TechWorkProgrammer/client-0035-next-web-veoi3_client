import React, {ReactNode, useState} from "react";
import {useRouter} from "next/router";
import Sidebar from "@/components/layout/Sidebar";
import {FaArrowLeft, FaBars, FaTimes} from "react-icons/fa";
import Button from "@/components/common/Button";
import Image from "next/image";

interface SidebarLayoutProps {
    children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({children}) => {
    const router = useRouter();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className="min-h-screen">
            <header
                className="fixed top-0 left-0 right-0 h-16 border-b border-b-secondary-200 bg-background-light text-white flex items-center justify-between px-4 z-40 lg:hidden">
                <div className="flex items-center gap-4">
                    <div className="lg:hidden">
                        <Button
                            color="primary"
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            icon={mobileSidebarOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
                            label=""
                        />
                    </div>
                    <div className="hidden lg:block">
                        <Button
                            color="primary"
                            onClick={() => setIsMinimized(!isMinimized)}
                            icon={isMinimized ? <FaBars size={20}/> : <FaTimes size={20}/>}
                            label=""
                        />
                    </div>
                    <Button
                        onClick={() => router.back()}
                        color="primary"
                        icon={<FaArrowLeft size={20}/>}
                        label="Back"
                    />
                </div>

                <div className="flex justify-end w-full">
                    <button onClick={() => router.push("/")}>
                        <Image
                            src="/icon.png"
                            alt="Cyhper Logo"
                            width={40}
                            height={40}
                            style={{objectFit: "contain"}}
                            priority
                        />
                    </button>
                </div>

            </header>
            <div className="pt-16 lg:pt-0 flex">
                <div className="hidden lg:block">
                    <Sidebar variant="desktop" isMinimized={isMinimized}/>
                </div>
                <div className="lg:hidden">
                    {mobileSidebarOpen && (
                        <Sidebar variant="mobile" toggleOpen={() => setMobileSidebarOpen(false)}/>
                    )}
                </div>
                <div className={`transition-all duration-300 flex-1 ${isMinimized ? "lg:ml-20" : "lg:ml-64"}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SidebarLayout;
