import React from "react";
import {useRouter} from "next/router";
import {FaMedium} from "react-icons/fa6";
import {RiTelegram2Fill} from "react-icons/ri";
import Image from "next/image";
import {FaXTwitter} from "react-icons/fa6";
import Icon from "@/components/common/Icon";


interface SidebarProps {
    variant: "desktop" | "mobile";
    isMinimized?: boolean;
    toggleOpen?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             variant,
                                             isMinimized = false,
                                             toggleOpen,
                                         }) => {
    const router = useRouter();

    const mainNav = [
        {label: "Explore", path: "/explore", icon: <Icon name="explore" className="w-4 h-4"/>},
        {label: "Like", path: "/like", icon: <Icon name="likes" className="w-4 h-4"/>},
    ];
    const libraryNav = [
        {label: "Studio", path: "/studio", icon: <Icon name="studio" className="w-5 h-5"/>},
        {label: "Gallery", path: "/gallery", icon: <Icon name="gallery" className="w-5 h-5"/>},
        {label: "Favorite", path: "/favorite", icon: <Icon name="favorites" className="w-5 h-5"/>},
    ];
    const allNavGroups = [mainNav, libraryNav];
    const handleNavigation = (path: string) => {
        router.push(path).then(() => {
            if (variant === "mobile" && toggleOpen) {
                toggleOpen();
            }
        });
    };
    const containerClasses =
        variant === "desktop"
            ? `fixed top-0 left-0 bottom-0 flex flex-col transition-all duration-300 ${
                isMinimized ? "w-20" : "w-56"
            }`
            : `fixed top-0 left-0 bottom-0 w-56 flex flex-col transition-all duration-300 z-20 pt-16 bg-background`;
    return (
        <>
            <aside
                className={`bg-transparent ${containerClasses}`}
            >
                <div
                    onClick={() => handleNavigation("/")}
                    className="hidden md:flex items-center justify-start px-4 pt-4 cursor-pointer mb-2 gap-3"
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src="/icon.png"
                            alt="VeoI3 Logo"
                            fill
                            style={{objectFit: "contain"}}
                            priority
                        />
                    </div>
                    <p className="ml-2 text-white font-semibold text-xl">Veoi3</p>
                </div>
                <div className="flex-1 overflow-y-auto mt-2">
                    {allNavGroups.map((group, groupIdx) => (
                        <React.Fragment key={groupIdx}>
                            {group.map((item) => (
                                <div key={item.path} className="px-3 py-1">
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center w-fit px-6 py-1.5 transition rounded-full font-semibold ${
                                            router.pathname === item.path
                                                ? "bg-secondary-100 text-white"
                                                : "hover:bg-accent-500/10 text-secondary"
                                        } ${
                                            variant === "desktop" && isMinimized
                                                ? "justify-center"
                                                : ""
                                        }`}
                                    >
                                        {item.icon}
                                        {(variant === "mobile" || !isMinimized) && (
                                            <span className="ml-3">{item.label}</span>
                                        )}
                                    </button>
                                </div>
                            ))}
                            {groupIdx < allNavGroups.length - 1 && (
                                <div className="mt-4 md:mt-8 px-6">
                                    <p className="ml-2 text-secondary-700 font-semibold text-lg">Library</p>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex flex-col justify-center items-center pb-8">
                    <div className="flex space-x-4 w-full justify-between px-6 md:px-8 py-6">
                        <a href="https://https://t.me/Veoi3/" target="_blank" rel="noopener noreferrer"
                           className="text-white hover:text-accent-500 transition bg-primary-600 rounded-full p-1.5">
                            <RiTelegram2Fill size={18}/>
                        </a>
                        <a href="https://x.com/veoi3official" target="_blank" rel="noopener noreferrer"
                           className="text-white hover:text-accent-500 transition bg-primary-600 rounded-full p-1.5">
                            <FaXTwitter size={18}/>
                        </a>
                        <a href="https://medium.com/" target="_blank" rel="noopener noreferrer"
                           className="text-white hover:text-accent-500 transition bg-primary-600 rounded-full p-1.5">
                            <FaMedium size={18}/>
                        </a>
                    </div>
                    <p className="text-secondary-700 font-semibold text-sm"
                       onClick={() => router.push("/terms-of-service")}>Terms of Service</p>
                    <p className="text-secondary-700 font-semibold text-sm">© 2025 VeoI3</p>
                </div>
            </aside>

        </>
    );
};

export default Sidebar;
