import {BrowserProvider} from "ethers";

let wcProvider: any = null;

export interface WalletResponse {
    success: boolean;
    address?: string;
    walletName?: string;
    error?: string;
}

export const connectWallet = async (
    walletName: string
): Promise<WalletResponse> => {
    if (typeof window === "undefined") {
        return {success: false, error: "Wallet connect not available server-side"};
    }
    try {
        if (walletName === "MetaMask") {
            const ethereum = (window as any).ethereum;
            if (ethereum?.isMetaMask) {
                await ethereum.request({method: "eth_requestAccounts"});
                const provider = new BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                localStorage.setItem("walletAddress", address);
                localStorage.setItem("connectedWallet", walletName);
                return {success: true, walletName, address};
            }
            /*const dappUrl = window.location.href;
            const linkUrl = `https://metamask.app.link/dapp/${encodeURIComponent(dappUrl)}`;
            window.open(linkUrl, "_blank");
            const address = await (async () => {
                const start = Date.now();
                while (Date.now() - start < 15000) {
                    if ((window as any).ethereum?.isMetaMask) {
                        try {
                            await (window as any).ethereum.request({method: "eth_requestAccounts"});
                            const provider = new BrowserProvider((window as any).ethereum);
                            const signer = await provider.getSigner();
                            return await signer.getAddress();
                        } catch {
                            return null;
                        }
                    }
                    await new Promise((r) => setTimeout(r, 500));
                }
                return null;
            })();
            if (!address) {
                return {success: false, error: "MetaMask injection timeout"};
            }
            localStorage.setItem("walletAddress", address);
            localStorage.setItem("connectedWallet", walletName);
            return {success: true, walletName, address};*/
            return {success: false, error: "Metamask only support Web Extension"};
        }

        if (walletName === "WalletConnect") {
            const {EthereumProvider} = await import("@walletconnect/ethereum-provider");
            const PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
            if (!wcProvider) {
                wcProvider = await EthereumProvider.init({
                    projectId: PROJECT_ID,
                    chains: [1],
                    optionalChains: [],
                    showQrModal: true,
                    methods: ["eth_requestAccounts", "personal_sign", "eth_signTypedData"],
                    events: ["accountsChanged", "chainChanged"],
                    metadata: {
                        name: "LogicAI DApp",
                        description: "LogicAI — generate 3D meshes with AI",
                        url: "https://logicai.technology",
                        icons: ["https://logicai.technology/favicon.ico"]
                    }
                });
            }

            try {
                await wcProvider.connect();

                const accounts: string[] = await wcProvider.request({
                    method: "eth_requestAccounts",
                });

                const provider = new BrowserProvider(wcProvider as any);
                const address = accounts[0] || await (await provider.getSigner()).getAddress();

                localStorage.setItem("walletAddress", address as string);
                localStorage.setItem("connectedWallet", walletName);
                return {success: true, walletName, address: address as string};
            } catch (err: any) {
                if (err.message.includes("Proposal expired")) {
                    await wcProvider.disconnect();
                    wcProvider = null;
                    return {success: false, error: "Session expired, please try again."};
                }
                return {
                    success: false,
                    error: err.message?.includes("User rejected")
                        ? "User rejected the request."
                        : err.message || "WalletConnect failed",
                };
            }
        }

        return {success: false, error: `${walletName} is not supported.`};
    } catch (error: any) {
        if (error.message?.includes("User rejected")) {
            return {success: false, error: "User rejected the request."};
        }
        return {success: false, error: error.message || "Unknown error."};
    }
};

export const disconnectWallet = async (): Promise<void> => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("connectedWallet");
    if (wcProvider) {
        await wcProvider.disconnect();
        wcProvider = null;
    }
};
