import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cypherai.app",
            },
            {
                protocol: "https",
                hostname: "api.cypherai.app",
            },
            {
                protocol: "https",
                hostname: "ui-avatars.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
        ],
    },
};

export default nextConfig;
