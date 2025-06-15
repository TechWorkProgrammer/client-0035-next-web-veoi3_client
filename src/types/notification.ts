export type NotificationType =
    | 'SUCCESS'
    | 'INFO'
    | 'WARNING'
    | 'ERROR'
    | 'PROMOTION'
    | 'STATUS_UPDATE';

export interface INotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    actionUrl?: string;
    isRead: boolean;
    createdAt: Date;
    deletedAt?: Date;
}
