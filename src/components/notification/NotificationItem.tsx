import {useNotification} from "@/context/Notification";
import {INotification} from "@/types/notification";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import {FaCircle, FaTrashAlt} from "react-icons/fa";
import {FiCheckSquare, FiMoreVertical} from "react-icons/fi";
import Modal from "@/components/common/Modal";
import {formatDistanceToNow} from "date-fns";

const NotificationItem: React.FC<{ notification: INotification }> = ({notification}) => {
    const {markAsRead, deleteNotification} = useNotification();
    const router = useRouter();
    const [detailModal, setDetailModal] = useState<INotification | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleNotificationClick = () => {
        if (!notification.isRead) markAsRead(notification.id).then();
        if (notification.actionUrl) router.push(notification.actionUrl).then();
        else setDetailModal(notification);
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <>
            <div className="relative py-2 border-b border-primary-700 transition-colors group">
                <button onClick={handleNotificationClick} className="w-full text-left">
                    <div className="flex items-start gap-2 pl-1 pr-4">
                        <div>
                            <div className="flex items-center space-x-2">
                                {!notification.isRead && (
                                    <FaCircle className="text-accent-400 w-2 h-2 flex-shrink-0"/>
                                )}
                                <p className="font-semibold text-sm">{notification.title}</p>
                            </div>
                            <p className="text-xs text-secondary-400 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-secondary-500 mt-2">{formatDistanceToNow(new Date(notification.createdAt))} ago</p>
                        </div>
                    </div>
                </button>

                <div className="absolute top-2 right-1" ref={menuRef}>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                            className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-primary-600 transition-opacity">
                        <FiMoreVertical/>
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.9}}
                                        className="absolute top-full right-0 mt-1 w-40 bg-primary-600 rounded-lg shadow-xl z-30 p-1">
                                {!notification.isRead && (
                                    <button onClick={(e) => handleActionClick(e, () => markAsRead(notification.id))}
                                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-primary-700">
                                        <FiCheckSquare/> Mark as read
                                    </button>
                                )}
                                <button onClick={(e) => handleActionClick(e, () => deleteNotification(notification.id))}
                                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/10">
                                    <FaTrashAlt/> Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {detailModal && (
                <Modal title={detailModal.title} onClose={() => setDetailModal(null)}>
                    <div className="px-2"><p
                        className="text-secondary-300 whitespace-pre-wrap">{detailModal.message}</p></div>
                </Modal>
            )}
        </>
    )
}

export default NotificationItem;