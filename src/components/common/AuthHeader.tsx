import React, {useState, useRef, useEffect} from 'react';
import {getUser} from '@/utils/user';
import {FaPlus} from 'react-icons/fa';
import Image from 'next/image';
import {motion, AnimatePresence} from 'framer-motion';
import Icon from "@/components/common/Icon";
import {useNotification} from "@/context/Notification";
import NotificationDropdown from "@/components/notification/NotificationDropdown";
import Loader from "@/components/common/Loader";

interface AuthHeaderProps {
    onConnectClick: () => void;
    onProfileClick: () => void;
    onPlanClick: () => void;
    onDisconnect: () => void;
    onPaymentHistoryClick: () => void;
    onCoinHistoryClick: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
                                                   onConnectClick,
                                                   onProfileClick,
                                                   onPlanClick,
                                                   onDisconnect,
                                                   onPaymentHistoryClick,
                                                   onCoinHistoryClick
                                               }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const user = getUser();
    const {unreadCount} = useNotification();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileDropdownRef]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationDropdownRef]);

    if (!isMounted) {
        return (<div className="flex justify-center items-center h-20"><Loader size="small"/></div>);
    }

    if (!user) {
        return (
            <button
                onClick={onConnectClick}
                className="bg-white text-black font-semibold text-lg px-6 py-1 rounded-full transition hover:bg-accent-400"
            >
                Connect
            </button>
        );
    }

    return (
        <div className="flex flex-row items-center gap-1 md:gap-4 font-semibold text-md">
            <div className="flex items-center justify-center gap-2 md:gap-3">
                <p className="text-sm md:text-lg font-bold text-white">{user.user.token || 0} <span
                    className="text-sm md:text-md ml-1">Token</span></p>
                <button
                    onClick={onPlanClick}
                    className="bg-white text-background-dark rounded-full w-3 h-3 md:w-5 md:h-5 flex items-center justify-center transition hover:bg-accent-500/40"
                    aria-label="Add Tokens"
                >
                    <FaPlus className="w-2 h-2 md:w-3 md:h-3"/>
                </button>
            </div>
            <div className="relative" ref={notificationDropdownRef}>
                <button
                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                    className="flex items-center justify-center p-2 transition hover:bg-accent-500/10 text-white rounded-full"
                >
                    <Icon name="notification" className="w-4 h-4 md:w-6 md:h-6"/>
                    {unreadCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-800">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <NotificationDropdown
                    isOpen={isNotificationDropdownOpen}
                    onClose={() => setIsNotificationDropdownOpen(false)}
                />
            </div>

            <div className="relative" ref={profileDropdownRef}>
                <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center transition rounded-full"
                >
                    <Image
                        src={user.user.profileImage || `https://ui-avatars.com/api/?name=${user.user.username}&background=random`}
                        alt={user.user.username}
                        width={40}
                        height={40}
                        className="w-4 h-4 md:w-8 md:h-8 rounded-full object-cover"
                    />
                </button>

                <AnimatePresence>
                    {isProfileDropdownOpen && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="absolute top-full right-0 mt-2 w-56 bg-primary-800 rounded-lg shadow-xl z-20 overflow-hidden"
                        >
                            <div className="p-2 text-white">
                                <button onClick={() => {
                                    onProfileClick();
                                    setIsProfileDropdownOpen(false)
                                }}
                                        className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-primary-700">
                                    <Icon name="profile" className="w-5 h-5"/>
                                    <span>Profile</span>
                                </button>
                                <button onClick={() => {
                                    onCoinHistoryClick();
                                    setIsProfileDropdownOpen(false)
                                }}
                                        className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-primary-700">
                                    <Icon name="credit" className="w-5 h-5"/>
                                    <span>Token History</span>
                                </button>
                                <button onClick={() => {
                                    onPaymentHistoryClick();
                                    setIsProfileDropdownOpen(false)
                                }}
                                        className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-primary-700">
                                    <Icon name="payment" className="w-5 h-5"/>
                                    <span>Payment History</span>
                                </button>
                            </div>
                            <div className="border-t border-primary-700 p-2">
                                <button
                                    className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-primary-700">
                                    <Icon name="support" className="w-5 h-5"/>
                                    <span>Support</span>
                                </button>
                            </div>
                            <div className="border-t border-primary-700 p-2">
                                <button onClick={() => {
                                    onDisconnect();
                                    setIsProfileDropdownOpen(false);
                                }}
                                        className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/10">
                                    <Icon name="logout" className="w-5 h-5"/>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuthHeader;