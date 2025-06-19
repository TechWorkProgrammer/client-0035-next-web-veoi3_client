import React, {useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNotification} from '@/context/Notification';
import NotificationItem from '@/components/notification/NotificationItem';
import Loader from '@/components/common/Loader';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown: React.FC<Props> = ({isOpen, onClose}) => {
    const {
        notifications,
        pagination,
        isLoadingMore,
        loadMoreNotifications,
    } = useNotification();

    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !containerRef.current || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    pagination &&
                    !isLoadingMore &&
                    pagination.currentPage < pagination.totalPages
                ) {
                    loadMoreNotifications().then();
                }
            },
            {
                root: containerRef.current,
                threshold: 1.0,
            }
        );

        observer.observe(sentinelRef.current);
        return () => {
            observer.disconnect();
        };
    }, [
        isOpen,
        pagination,
        isLoadingMore,
        loadMoreNotifications,
    ]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={wrapperRef}
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    className="absolute top-full right-0 mt-2 w-80 bg-background-dark rounded-lg shadow-xl z-20 px-2"
                >
                    <div
                        ref={containerRef}
                        className="max-h-96 overflow-y-auto"
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                />
                            ))
                        ) : (
                            <p className="p-6 text-center text-sm text-secondary-500">
                                No notifications yet.
                            </p>
                        )}

                        <div ref={sentinelRef}/>

                        {isLoadingMore && (
                            <div className="flex justify-center py-2">
                                <Loader size="small"/>
                            </div>
                        )}

                        {!isLoadingMore &&
                            pagination &&
                            pagination.currentPage >= pagination.totalPages && (
                                <p className="text-center text-sm text-secondary-500 py-4">
                                    You’ve reached the end.
                                </p>
                            )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
