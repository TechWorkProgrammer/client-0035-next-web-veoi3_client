import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNotification} from "@/context/Notification";
import NotificationItem from "@/components/notification/NotificationItem";


const NotificationDropdown: React.FC<{ isOpen: boolean, onClose: () => void }> = ({isOpen}) => {
    const {notifications} = useNotification();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                    className="absolute top-full right-0 mt-2 py-2 px-3 w-80 bg-background-dark rounded-lg shadow-xl z-20"
                >
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (<NotificationItem key={notif.id} notification={notif}/>))
                        ) : (
                            <p className="p-6 text-center text-sm text-secondary-500">No notifications yet.</p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;