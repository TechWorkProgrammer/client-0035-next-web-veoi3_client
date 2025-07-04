import React, {createContext, useContext, useEffect, useState, ReactNode, useCallback} from 'react';
import {io} from 'socket.io-client';
import {getUser} from '@/utils/user';
import {INotification} from '@/types/notification';
import api from "@/utils/axios";
import {useAlert} from "@/context/Alert";
import {useWallet} from "@/context/Wallet";

interface INotificationData {
    notifications: INotification[];
    pagination: any;
    unreadCount: number;
}

interface NotificationContextType {
    notifications: INotification[];
    unreadCount: number;
    isLoadingMore: boolean;
    pagination: INotificationData["pagination"] | null;
    markAsRead: (notificationId: string) => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    loadMoreNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState<NotificationContextType["pagination"]>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const user = getUser();
    const alert = useAlert();
    const {refreshUser} = useWallet();

    useEffect(() => {
        if (user?.user.id) {
            const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3010");

            newSocket.on('connect', () => {
                newSocket.emit('join', user.user.id);
            });

            newSocket.on('initial_notifications', (data: INotificationData) => {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
                setPagination(data.pagination);
            });

            newSocket.on('new_notification', (newNotification: INotification) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
                refreshUser().then();
                alert("New Notification", newNotification.title, "info");
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [alert, refreshUser, user?.user.id]);

    const loadMoreNotifications = useCallback(async () => {
        if (
            !pagination ||
            isLoadingMore ||
            pagination.currentPage >= pagination.totalPages
        ) {
            return;
        }

        setIsLoadingMore(true);
        try {
            const nextPage = pagination.currentPage + 1;
            const res = await api.get<{ data: INotificationData }>('/notification', {
                params: {page: nextPage, limit: pagination.limit}
            });
            const data = res.data.data;

            setNotifications(prev => [...prev, ...data.notifications]);
            setPagination(data.pagination);
        } catch (error: any) {
            alert("Error", "Failed to load more notifications: " + error.message, "error");
        } finally {
            setIsLoadingMore(false);
        }
    }, [pagination, isLoadingMore, alert]);

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
            await api.delete(`/notification/${notificationId}`);
        } catch (error: any) {
            alert("Error", "Failed to delete notification - " + error.message, "error");
            setNotifications(originalNotifications);
            if (notificationToDelete && !notificationToDelete.isRead) {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [alert, notifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            pagination,
            isLoadingMore,
            markAsRead,
            deleteNotification,
            loadMoreNotifications
        }}>
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