import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {connectWallet as connectChain, disconnectWallet as disconnectChain} from "@/utils/wallet";
import {saveUser, clearUser, getUser, getAccessToken} from "@/utils/user";
import {useAlert} from "@/context/Alert";
import {useLoader} from "@/context/Loader";
import {BrowserProvider} from "ethers";
import api from "@/utils/axios";
import LogoutConfirmationModal from "@/components/common/LogoutConfirmationModal";

interface WalletContextType {
    connectedWallet: string | null;
    walletAddress: string | null;
    isConnecting: boolean;
    connectWallet: (
        walletName: string,
        address?: string,
        password?: string,
        isRegister?: boolean
    ) => Promise<void>;
    disconnectWallet: () => void;
    refreshUser: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const alert = useAlert();
    const loader = useLoader();
    const API = "/auth";

    useEffect(() => {
        const initialUser = getUser();
        if (initialUser) {
            setConnectedWallet(initialUser.walletType);
            setWalletAddress(initialUser.user.address);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const u = getUser();
            if (!u && connectedWallet) {
                setConnectedWallet(null);
                setWalletAddress(null);
            } else if (u && u.user.address !== walletAddress) {
                setConnectedWallet(u.walletType);
                setWalletAddress(u.user.address);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [connectedWallet, walletAddress]);

    const refreshUser = async () => {
        loader(true);
        try {
            const token = getAccessToken();
            if (!token) {
                alert(
                    "Authentication Required",
                    "No valid session found. Please reconnect your wallet.",
                    "error"
                );
                clearUser();
                setConnectedWallet(null);
                setWalletAddress(null);
                return;
            }
            const res = await api.get(`/user/me`);
            const updated = res.data.data;
            saveUser({
                user: updated,
                accessToken: token,
                refreshToken: getUser()?.refreshToken || "",
                walletType: connectedWallet || "unknown",
            });
            setConnectedWallet(getUser()!.walletType);
            setWalletAddress(updated.address);
            alert(
                "Data Refreshed",
                "Your account information has been updated.",
                "success"
            );
        } catch (err: any) {
            alert(
                "Refresh Failed",
                err?.message || "Unable to update user data.",
                "error"
            );
        } finally {
            loader(false);
        }
    };

    const connectWallet = async (
        walletName: string,
        address?: string,
        password?: string,
        isRegister = false
    ) => {
        setIsConnecting(true);
        loader(true, {size: "large"});
        try {
            if (walletName === "VeoI3") {
                const url = isRegister ? "/register" : "/login";
                const payload = isRegister
                    ? {username: address, password, repeat_password: password}
                    : {username: address, password};
                const res = await api.post(`${API}${url}`, payload);
                const {user, accessToken, refreshToken} = res.data.data;
                saveUser({
                    user: user,
                    accessToken,
                    refreshToken,
                    walletType: "VeoI3",
                });
                setConnectedWallet("VeoI3");
                setWalletAddress(user.address);
                alert("Authorized", `${isRegister ? "Registered" : "Logged in"} as ${user.username}`, "success");
            } else {
                const result = await connectChain(walletName);
                if (!result.success || !result.address) {
                    alert("Opps", result.error || "Failed to connect wallet", "error");
                    return;
                }
                const addr = result.address;
                const nonceRes = await api.get(`${API}/nonce`, {params: {address: addr}});
                const nonce = nonceRes.data.data.nonce;
                let signature: string;
                if (walletName === "WalletConnect") {
                    const provider = new BrowserProvider((window as any).ethereum);
                    const signer = await provider.getSigner();
                    signature = await signer.signMessage(nonce);
                } else {
                    const provider = new BrowserProvider((window as any).ethereum);
                    const signer = await provider.getSigner();
                    signature = await signer.signMessage(nonce);
                }
                const loginRes = await api.post(`${API}/wallet-login`, {address: addr, signature});
                const {user, accessToken, refreshToken} = loginRes.data.data;
                saveUser({
                    user,
                    accessToken,
                    refreshToken,
                    walletType: walletName,
                });
                setConnectedWallet(walletName);
                setWalletAddress(addr);
                alert("Authorized", `Connected with ${walletName}`, "success");
            }
        } catch (e: any) {
            alert("Opps", e.response?.data?.message || e.message, "error");
        } finally {
            setIsConnecting(false);
            loader(false);
        }
    };

    const disconnectWallet = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <WalletContext.Provider
            value={{connectedWallet, walletAddress, isConnecting, connectWallet, disconnectWallet, refreshUser}}
        >
            {children}
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={async () => {
                    setIsLogoutModalOpen(false);
                    loader(true, {size: "large"});
                    await disconnectChain();
                    clearUser();
                    setConnectedWallet(null);
                    setWalletAddress(null);
                    loader(false);
                    alert("Disconnected", "You have been successfully logged out.", "info");
                }}
            />
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextType => {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error("useWallet must be within WalletProvider");
    return ctx;
};
