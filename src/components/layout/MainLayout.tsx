import React, {useState, ReactNode} from 'react';
import SidebarLayout from "@/components/layout/SidebarLayout";
import AuthHeader from "@/components/common/AuthHeader";
import {useWallet} from "@/context/Wallet";
import ModalPlan from "@/components/payment/ModalPlan";
import WalletConnectModal from "@/components/common/WalletConnectModal";
import PaymentHistoryModal from "@/components/payment/PaymentHistoryModal";

interface MainPageLayoutProps {
    headerComponent: ReactNode;
    children: ReactNode;
}

const MainLayout: React.FC<MainPageLayoutProps> = ({headerComponent, children}) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
    const {disconnectWallet} = useWallet();

    return (
        <SidebarLayout>
            <div className="rounded-lg flex-1 flex flex-col p-3 md:px-6">
                <div className="flex flex-row justify-between mb-4 items-center">
                    {headerComponent}

                    <AuthHeader
                        onConnectClick={() => setIsProfileModalOpen(true)}
                        onProfileClick={() => setIsProfileModalOpen(true)}
                        onPlanClick={() => setIsPlanModalOpen(true)}
                        onPaymentHistoryClick={() => setIsPaymentHistoryOpen(true)}
                        onDisconnect={disconnectWallet}
                    />
                </div>

                <div className="w-full space-y-6">
                    <div className="w-full pt-4">
                        {children}
                    </div>
                </div>
            </div>

            <ModalPlan isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)}/>
            <WalletConnectModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}/>
            <PaymentHistoryModal isOpen={isPaymentHistoryOpen} onClose={() => setIsPaymentHistoryOpen(false)}/>
        </SidebarLayout>
    );
};

export default MainLayout;