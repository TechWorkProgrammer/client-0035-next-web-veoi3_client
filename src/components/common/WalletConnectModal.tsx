import React, {useState} from "react";
import {createPortal} from "react-dom";
import {FaTimes} from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/common/Button";
import {useWallet} from "@/context/Wallet";
import {useAlert} from "@/context/Alert";
import {useLoader} from "@/context/Loader";
import {getUser} from "@/utils/user";
import LoggedInComponent from "@/components/common/LoggedIn";

interface WalletConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const wallets = [
    {
        name: "MetaMask",
        icon: "/assets/wallets/metamask.png",
        description:
            "MetaMask is a popular Ethereum wallet that lets users manage cryptocurrency, access dApps, and interact with the blockchain.",
    },
    {
        name: "WalletConnect",
        icon: "/assets/wallets/walletconnect.png",
        description:
            "Connect using WalletConnect-compatible mobile wallets via QR code or deep linking.",
    },
    {
        name: "VeoI3",
        icon: "/icon.png",
        description: "Use your address and password to connect securely.",
    },
];

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({isOpen, onClose}) => {
    const {connectWallet, connectedWallet} = useWallet();
    const alert = useAlert();
    const loader = useLoader();
    const user = getUser();

    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [form, setForm] = useState({address: "", password: "", repeat_password: ""});

    if (!isOpen) return null;

    const handleConnect = async () => {
        if (selectedWallet === "VeoI3") {
            if (!form.address || !form.password || (mode === "register" && form.password !== form.repeat_password)) {
                alert("Validation Error", "Please fill all fields correctly.", "error");
                return;
            }
            await connectWallet(selectedWallet, form.address, form.password, mode === "register");
        } else {
            await connectWallet(selectedWallet || "");
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center overflow-auto">
            <div className="bg-background-dark rounded-2xl shadow-lg w-fit max-w-2xl mx-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-secondary-500 hover:text-white">
                    <FaTimes size={24}/>
                </button>
                <div className="flex flex-col md:flex-row">
                    {connectedWallet ? (
                        <LoggedInComponent user={user} alert={alert}
                                           loader={loader}/>
                    ) : (
                        <>
                            {user == null && (
                                <div className="w-full md:w-2/5 rounded-l-lg border-r-2 border-secondary-500 px-8 py-6">
                                    <h3 className="text-lg font-semibold text-white mb-2 pt-2">Choose a Wallet</h3>
                                    <ul className="space-y-3">
                                        {wallets.map((w) => (
                                            <li
                                                key={w.name}
                                                onClick={() => {
                                                    setSelectedWallet(w.name);
                                                    if (w.name !== "VeoI3") setMode("login");
                                                }}
                                                className={`${
                                                    w.name === "MetaMask" ? "hidden md:flex" : "flex"
                                                } items-center gap-3 p-3 rounded-lg cursor-pointer ${
                                                    selectedWallet === w.name ? "bg-black" : "hover:bg-black"
                                                }`}
                                            >
                                                <Image src={w.icon} alt={w.name} width={32} height={32}/>
                                                <span className="text-white font-semibold">{w.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex-1 rounded-r-lg w-[24rem]">
                                {selectedWallet === "VeoI3" ? (
                                    <div className="flex flex-col justify-start h-full">
                                        <h3 className="text-xl font-bold text-white p-4">
                                            {mode === "login" ? "VeoI3 Login" : "VeoI3 Register"}
                                        </h3>
                                        <div className="px-4 flex flex-col gap-4">
                                            <div>
                                                <label
                                                    htmlFor="username"
                                                    className="block text-sm font-medium text-white mb-2"
                                                >
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    value={form.address}
                                                    onChange={(e) => setForm({...form, address: e.target.value})}
                                                    className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none"
                                                    placeholder="Enter your username"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="password"
                                                    className="block text-sm font-medium text-white mb-2"
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    value={form.password}
                                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                                    className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none"
                                                    placeholder="Enter your password"
                                                />
                                            </div>

                                            {mode === "register" && (
                                                <div>
                                                    <label
                                                        htmlFor="repeat_password"
                                                        className="block text-sm font-medium text-white mb-2"
                                                    >
                                                        Re-type password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="repeat_password"
                                                        id="repeat_password"
                                                        value={form.repeat_password}
                                                        onChange={(e) => setForm({
                                                            ...form,
                                                            repeat_password: e.target.value
                                                        })}
                                                        className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none"
                                                        placeholder="Re-type your password"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-4">
                                                <button
                                                    className="text-sm text-white"
                                                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                                                >
                                                    {mode === "login" ? "Need to register?" : "Back to login"}
                                                </button>
                                                <Button label={mode === "login" ? "Login" : "Register"}
                                                        onClick={handleConnect}
                                                        color="primary"/>
                                            </div>
                                        </div>
                                    </div>
                                ) : selectedWallet ? (
                                    <div className="flex flex-col gap-4 h-full justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 p-4">{selectedWallet}</h3>
                                            <p className="text-white mb-4 px-4">
                                                {wallets.find((w) => w.name === selectedWallet)?.description}
                                            </p>
                                        </div>
                                        <div className="flex align-center justify-end mx-4 mb-4">
                                            <Button label="Connect"
                                                    onClick={handleConnect}
                                                    color="primary"/>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white text-center py-12 font-semibold text-lg">Select a wallet to
                                        continue.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WalletConnectModal;
