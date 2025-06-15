import React, {useState} from "react";
import WalletConnectModal from "@/components/common/WalletConnectModal";
import Button from "@/components/common/Button";
import Image from "next/image";

const ProtectedPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-center w-full h-[90vh]">
            <div
                className="text-center space-y-4 py-4 md:py-12 rounded shadow-lg w-full max-w-lg mx-4 md:mx-0 bg-background-light"
            >
                <div className="flex justify-center">
                    <Image
                        src="/icon.png"
                        alt="Coming Soon Icon"
                        width={100}
                        height={100}
                        priority
                        className="object-contain"
                    />
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">
                    Connect Required
                </p>
                <p className="text-sm md:text-base text-secondary-700 leading-relaxed">
                    Please connect your wallet to access this feature.
                </p>
                <div className="flex justify-center h-12">
                    <Button
                        label="Connect Wallet"
                        onClick={() => setIsModalOpen(true)}
                        color="primary"
                    />
                </div>
                <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
            </div>
        </div>
    );
};

export default ProtectedPage;
