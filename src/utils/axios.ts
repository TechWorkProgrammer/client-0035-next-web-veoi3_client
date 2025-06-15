import axios, {InternalAxiosRequestConfig, AxiosError} from 'axios';
import {
    forceLogout,
    getAccessToken,
    getRefreshToken,
    updateTokens,
} from '@/utils/user';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({resolve, reject}) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getAccessToken();
        config.headers = config.headers ?? {};
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError & { config?: InternalAxiosRequestConfig }) => {
        const originalRequest = err.config!;
        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then((token) => {
                    originalRequest.headers!['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();
            return new Promise((resolve, reject) => {
                axios
                    .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {refreshToken})
                    .then(({data}) => {
                        const {accessToken, refreshToken} = data.data;
                        updateTokens(accessToken, refreshToken);
                        processQueue(null, accessToken);
                        originalRequest.headers!['Authorization'] = `Bearer ${accessToken}`;
                        resolve(api(originalRequest));
                    })
                    .catch((refreshErr) => {
                        processQueue(refreshErr, null);
                        forceLogout();
                        reject(refreshErr);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }
        return Promise.reject(err);
    }
);

export default api;
