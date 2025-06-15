import {IUserAuth} from "@/types/user";

const USER_KEY = "VEOI3_CLIENT_AUTH";

const isBrowser = (): boolean => typeof window !== "undefined";

export const saveUser = (data: IUserAuth): void => {
    if (!isBrowser()) return;
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch (err) {
        console.error("Error saving user data:", err);
    }
};

export const getUser = (): IUserAuth | null => {
    if (!isBrowser()) return null;
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as IUserAuth;
    } catch (err) {
        console.error("Error reading user data:", err);
        return null;
    }
};

export const clearUser = (): void => {
    if (!isBrowser()) return;
    try {
        localStorage.removeItem(USER_KEY);
    } catch (err) {
        console.error("Error clearing user data:", err);
    }
};

export const getAccessToken = (): string | null => {
    return getUser()?.accessToken || null;
};

export const getRefreshToken = (): string | null => {
    return getUser()?.refreshToken || null;
};

export const updateTokens = (
    accessToken: string,
    refreshToken: string
): void => {
    const u = getUser();
    if (!u) return;
    saveUser({...u, accessToken, refreshToken});
};

export const updateUsername = (username: string): void => {
    const auth = getUser();
    if (!auth) return;

    const updatedAuth: IUserAuth = {
        ...auth,
        user: {
            ...auth.user,
            username
        }
    };

    saveUser(updatedAuth);
};

export const forceLogout = () => {
    clearUser();
    if (typeof window !== "undefined") {
        window.location.reload();
    }
};
