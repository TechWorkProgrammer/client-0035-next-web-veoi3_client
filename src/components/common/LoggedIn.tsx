import React, {useState} from "react";
import {FaPlus, FaSyncAlt} from "react-icons/fa";
import {format} from 'date-fns';
import Image from "next/image";
import api from "@/utils/axios";
import {getUser, getAccessToken, clearUser, updateUsername} from "@/utils/user";
import {FiEdit} from "react-icons/fi";
import {PiCopySimpleBold} from "react-icons/pi";
import Button from "@/components/common/Button";
import ModalPlan from "@/components/payment/ModalPlan";
import {useWallet} from "@/context/Wallet";

interface LoggedInComponentProps {
    user: ReturnType<typeof getUser>;
    alert: (title: string, message: string, type: "success" | "error" | "info") => void;
    loader: (state: boolean) => void;
}

const walletIconMap: Record<string, string> = {
    MetaMask: "/assets/wallets/metamask.png",
    WalletConnect: "/assets/wallets/walletconnect.png",
    VeoI3: "/icon.png",
};

const LoggedInComponent: React.FC<LoggedInComponentProps> = ({
                                                                 user,
                                                                 alert,
                                                                 loader,
                                                             }) => {
    const [username, setUsername] = useState<string>(user?.user.username || "");
    const [editMode, setEditMode] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    const isUsernameChanged = user?.user.username !== username;

    const walletIconSrc = walletIconMap[user?.walletType || ""] || "/assets/wallets/default.png";
    const { refreshUser } = useWallet();

    const handleUpdateUsername = async () => {
        if (!username || username.length < 4 || username.length > 20) {
            alert(
                "Invalid Username",
                "Username must be between 4 and 20 characters long.",
                "error"
            );
            return;
        }
        loader(true);
        try {
            const token = getAccessToken();
            if (!token) {
                alert(
                    "Authentication Required",
                    "No valid session found. Please connect your wallet again.",
                    "error"
                );
                clearUser();
                return;
            }
            await api.put(`/user/username`, {username});
            updateUsername(username);
            setEditMode(false);
            alert("Username updated", "Your display name has been changed.", "success");
        } catch (err: any) {
            alert("Update Failed", err.message || "Unable to change username.", "error");
        } finally {
            loader(false);
        }
    };

    const handleCopyAddress = () => {
        if (user?.user.address) {
            navigator.clipboard.writeText(user.user.address).then(() => {
                alert("Copied to Clipboard", "Wallet address has been copied.", "success");
            });
        }
    };

    return (
        <div className="w-full p-4 md:px-6 min-w-[20rem] xl:min-w-[28rem]">
            <div className="flex flex-col items-start justify-start w-full">
                <div className="flex items-center w-full space-x-3 mb-4 md:mb-6">
                    <div
                        className="w-6 h-6 rounded-full flex justify-center items-center shadow">
                        <Image
                            src={walletIconSrc}
                            alt={user?.walletType || "Wallet"}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-gray-400 font-semibold text-xl">{`${user?.walletType} wallet`}</h1>
                </div>
                <div className="flex flex-col items-center justify-start w-full">
                    <div className="relative mb-6">
                        <Image
                            src={user?.user.profileImage || `https://ui-avatars.com/api/?name=${user?.user.username}&background=random`}
                            alt="Profile Avatar"
                            width={780}
                            height={780}
                            className="w-20 h-20 rounded-full border-2 border-primary-500"
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={!editMode}
                                    className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none disabled:cursor-not-allowed"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {editMode ? (
                                        <button onClick={() => {
                                            setUsername(user?.user.username || '');
                                            setEditMode(false);
                                        }} className="text-secondary-400 hover:text-white text-sm">Cancel</button>
                                    ) : (
                                        <FiEdit onClick={() => setEditMode(true)}
                                                className="text-secondary-400 cursor-pointer hover:text-white"/>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                                Wallet Address
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={user?.user.address || "Unknown Address"}
                                    disabled
                                    className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none cursor-not-allowed"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <PiCopySimpleBold onClick={handleCopyAddress}
                                                      className="text-secondary-400 cursor-pointer hover:text-white"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-4 my-4">
                        <div>
                            <p className="text-sm text-white">Total Tokens</p>
                            <div className="flex items-center justify-start gap-3 mt-1">
                                <p className="text-md font-bold text-white">{user?.user.token || 0} <span
                                    className="text-sm ml-1">Token</span></p>
                                <button
                                    onClick={() => setIsPlanModalOpen(true)}
                                    className="bg-white text-background-dark rounded-full w-4 h-4 flex items-center justify-center transition hover:bg-accent-500/40"
                                    aria-label="Add Tokens"
                                >
                                    <FaPlus className="w-2 h-2"/>
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-white">Total $VEOI</p>
                            <p className="text-md font-bold text-white mt-1">{user?.user.point || 0} <span
                                className="text-sm ml-1">$VEOI</span></p>
                        </div>
                    </div>

                    <p className="text-xs text-secondary-200 w-full text-start my-4">
                        Your account was created
                        on {user?.user.createdAt ? format(new Date(user.user.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </p>

                    <div className="w-full flex items-center justify-end gap-4">
                        <button
                            onClick={refreshUser}
                            className="flex items-center justify-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-full transition hover:bg-primary-600"
                        >
                            <FaSyncAlt/>
                            Refresh
                        </button>
                        {isUsernameChanged && editMode && (
                            <Button onClick={handleUpdateUsername} label="Save Changes" color="primary"/>
                        )}
                    </div>
                </div>
            </div>
            <ModalPlan
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
            />
        </div>
    );
};

export default LoggedInComponent;
