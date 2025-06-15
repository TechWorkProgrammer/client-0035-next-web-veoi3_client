import React, {useState, useEffect, useMemo} from 'react';
import Modal from '@/components/common/Modal';
import {IPlan} from '@/types/plan';
import {getUser} from '@/utils/user';
import {PiCopySimpleBold} from 'react-icons/pi';
import Button from '@/components/common/Button';
import {useAlert} from "@/context/Alert";
import api from "@/utils/axios";
import DropzoneInput from "@/components/common/DropzoneInput";
import {AiOutlineArrowDown} from "react-icons/ai";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plans: IPlan[];
    initialPlanId: string | null;
}

const DESTINATION_WALLET = "Ini Target Address";

const PaymentModal: React.FC<PaymentModalProps> = ({isOpen, onClose, plans, initialPlanId}) => {
    const user = getUser();
    const [selectedPlanId, setSelectedPlanId] = useState<string | 'custom'>(initialPlanId || 'custom');
    const [customToken, setCustomToken] = useState(5000);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    useEffect(() => {
        if (isOpen) {
            setSelectedPlanId(initialPlanId || 'custom');
            if (initialPlanId !== 'custom') {
                setCustomToken(0);
            } else {
                setCustomToken(5000);
            }
        }
    }, [isOpen, initialPlanId]);

    const {totalTokens, totalPrice} = useMemo(() => {
        if (selectedPlanId === 'custom') {
            const price = (customToken / 10);
            return {totalTokens: customToken, totalPrice: price};
        }
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        if (selectedPlan) {
            const price = Number(selectedPlan.price.replace('$', ''));
            return {totalTokens: selectedPlan.tokens, totalPrice: price};
        }
        return {totalTokens: 0, totalPrice: 0};
    }, [selectedPlanId, customToken, plans]);

    const handleSubmit = async () => {
        if (!paymentProof) {
            alert("Validation Error", "Please upload your payment proof.", "error");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        if (selectedPlanId === 'custom') {
            formData.append('customTokenAmount', String(customToken));
        } else {
            formData.append('planId', selectedPlanId);
        }
        formData.append('totalPrice', String(totalPrice));
        formData.append('image', paymentProof);

        try {
            await api.post('/payment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Success", "Your payment has been submitted and is waiting for review.", "success");
            onClose();
        } catch (error: any) {
            alert("Submission Failed", error.response?.data?.message || "An error occurred.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal title="Payment" onClose={onClose}>
            <form className="space-y-4 p-2 py-4">
                <div>
                    <label htmlFor="walletAddress" className="block text-sm font-medium text-secondary-400 mb-1">Your
                        wallet address</label>
                    <input type="text" id="walletAddress" value={user?.user.address || ''} disabled
                           className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none cursor-not-allowed disabled:text-secondary-400"/>
                </div>

                <div>
                    <label htmlFor="creditPlan" className="block text-sm font-medium text-secondary-400 mb-1">Credit
                        plan</label>
                    <div className="relative w-full">
                        <select
                            id="creditPlan"
                            value={selectedPlanId}
                            onChange={e => setSelectedPlanId(e.target.value)}
                            className="block w-full bg-background-light rounded-xl py-2 pl-3 pr-10 text-white focus:outline-none appearance-none"
                        >
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.name} - {plan.tokens} Tokens</option>
                            ))}
                            <option value="custom">Customize (Minimum 5000 Token)</option>
                        </select>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AiOutlineArrowDown className="text-secondary-400 w-5 h-5"/>
                        </div>
                    </div>
                </div>


                <div>
                    <label htmlFor="totalToken" className="block text-sm font-medium text-secondary-400 mb-1">Total
                        Token</label>
                    <input type="number" id="totalToken" value={totalTokens} disabled={selectedPlanId !== 'custom'}
                           onChange={e => setCustomToken(Number(e.target.value))}
                           min={selectedPlanId === 'custom' ? 5000 : undefined}
                           className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none disabled:text-secondary-400"/>
                </div>

                <div>
                    <label htmlFor="totalPayment" className="block text-sm font-medium text-secondary-400 mb-1">Total
                        Payment</label>
                    <input type="text" id="totalPayment" value={`$${totalPrice.toFixed(2)}`} disabled
                           className="block w-full bg-background-dark rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none"/>
                </div>

                <div>
                    <label htmlFor="destinationWallet" className="block text-sm font-medium text-secondary-400 mb-1">Destination
                        wallet</label>
                    <div className="relative">
                        <input type="text" id="destinationWallet" value={DESTINATION_WALLET} disabled
                               className="block w-full bg-background-light rounded-xl py-2 px-3 text-white placeholder:text-secondary-200 focus:outline-none"/>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <PiCopySimpleBold onClick={() => navigator.clipboard.writeText(DESTINATION_WALLET)}
                                              className="text-secondary-400 cursor-pointer hover:text-white"/>
                        </div>
                    </div>
                </div>

                <DropzoneInput onFileChange={setPaymentProof} label="Transfer Proof (Please provide your txhash)"/>

                <div className="pt-4 flex w-full items-end justify-end">
                    <Button
                        label={isLoading ? 'Processing...' : 'Submit Payment'}
                        onClick={handleSubmit}
                        color="primary"
                        disabled={isLoading || !paymentProof}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default PaymentModal;