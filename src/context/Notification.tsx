import React, {createContext, useContext, useEffect, useState, ReactNode, useCallback} from 'react';
import {io} from 'socket.io-client';
import {getUser} from '@/utils/user';
import {INotification} from '@/types/notification';
import api from "@/utils/axios";
import {useAlert} from "@/context/Alert";

interface INotificationData {
    notifications: INotification[];
    pagination: any;
    unreadCount: number;
}

interface NotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    markAsRead: (notificationId: string) => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const user = getUser();
    const alert = useAlert();

    useEffect(() => {
        if (user?.user.id) {
            const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3010");

            newSocket.on('connect', () => {
                newSocket.emit('join', user.user.id);
            });

            newSocket.on('initial_notifications', (data: INotificationData) => {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            });

            newSocket.on('new_notification', (newNotification: INotification) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
                alert("New Notification", newNotification.title, "info");
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [alert, user?.user.id]);

    const markAsRead = useCallback(async (notificationId: string) => {
        const originalNotifications = [...notifications];
        const newNotifications = notifications.map(n =>
            n.id === notificationId && !n.isRead ? {...n, isRead: true} : n
        );

        const didUpdate = originalNotifications.some(n => n.id === notificationId && !n.isRead);

        if (didUpdate) {
            setNotifications(newNotifications);
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        try {
            await api.put(`/notification/${notificationId}/read`);
        } catch (error) {
            alert("Opps...", "Failed to mark notification as read:" + error, "info");
            setNotifications(originalNotifications);
            if (didUpdate) setUnreadCount(prev => prev + 1);
        }
    }, [alert, notifications]);

    const deleteNotification = useCallback(async (notificationId: string) => {
        const originalNotifications = [...notifications];
        const notificationToDelete = originalNotifications.find(n => n.id === notificationId);

        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notificationToDelete && !notificationToDelete.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        try {
            await api.delete(`/notifications/${notificationId}`);
        } catch (error: any) {
            alert("Error", "Failed to delete notification - " + error.message, "error");
            setNotifications(originalNotifications);
            if (notificationToDelete && !notificationToDelete.isRead) {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [alert, notifications]);

    const value = {notifications, unreadCount, markAsRead, deleteNotification};

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};