export type Role = 'USER' | 'ADMIN';

export interface IUser {
    id: string;
    username: string;
    address: string;
    point: number;
    token: number;
    role: Role;
    profileImage?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IUserAuth {
    user: IUser;
    accessToken: string;
    refreshToken: string;
    walletType: string;
}