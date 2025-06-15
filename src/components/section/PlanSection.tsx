import React, {useState, useEffect, useCallback, useRef} from "react";
import {motion} from "framer-motion";
import Button from "@/components/common/Button";
import {useAlert} from "@/context/Alert";
import Loader from "@/components/common/Loader";
import {IPlan} from "@/types/plan";
import api from "@/utils/axios";
import {useWallet} from "@/context/Wallet";
import WalletConnectModal from "@/components/common/WalletConnectModal";
import PaymentModal from "@/components/payment/PaymentModal";


const PlanSection = () => {
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {connectedWallet} = useWallet();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const alert = useAlert();
    const hasFetchedRef = useRef(false);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/plans");
            const transformedPlans: IPlan[] = response.data.data.map((planFromApi: any) => ({
                id: planFromApi.id,
                name: planFromApi.name,
                description: planFromApi.description || "Perfect for starting your AI video creation journey.",
                price: `$${parseFloat(planFromApi.price).toFixed(0)}`,
                tokens: planFromApi.tokens,
            }));
            setPlans(transformedPlans);
        } catch (error: any) {
            alert("Ouch...", "Failed to load pricing plans: " + error.message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [alert]);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchPlans().then();
        }
    }, [fetchPlans]);

    const handleGetStartedClick = (planId: string) => {
        if (!connectedWallet) {
            setIsConnectModalOpen(true);
        } else {
            setSelectedPlanId(planId);
            setIsPaymentModalOpen(true);
        }
    };

    if (isLoading) {
        return (
            <div className="flex w-full min-h-screen mx-auto py-10 items-center justify-center">
                <Loader/>
            </div>
        );
    }

    return (
        <motion.section
            className="relative flex flex-col items-center justify-start min-h-screen text-white py-16 px-4 bg-transparent overflow-visible"
            id="pricing"
        >
            <motion.div
                className="absolute w-[50%] aspect-square rounded-full bg-background-blue -top-96 -left-[45vw] blur-2xl"
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: false}}
                transition={{duration: 0.8}}
            />

            <motion.div
                className="absolute w-[50%] aspect-square rounded-full bg-background-blue -top-14 -right-[40vw] blur-2xl"
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: false}}
                transition={{duration: 0.8}}
            />

            <motion.div
                className="absolute w-[30%] aspect-square rounded-full bg-background-blue -bottom-96 -left-[20vw] blur-2xl"
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: false}}
                transition={{duration: 0.8}}
            />
            <motion.h5
                className="text-xl font-bold text-secondary-600 text-center z-10 tracking-widest"
            >
                Pricing
            </motion.h5>
            <motion.h1
                className="text-4xl md:text-5xl font-bold my-4 text-white text-center z-10"
            >
                Get Credits. Start Creating Videos.
            </motion.h1>
            <motion.h5
                className="text-xl font-bold mb-12 text-secondary-600 text-center z-10"
            >
                Maximize your video creations with flexible and cost-effective credit packs.
            </motion.h5>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full z-10">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        className="bg-background-dark p-8 rounded-3xl shadow-xl hover:scale-105 transform transition duration-300 max-w-sm flex flex-col justify-between"
                    >
                        <div className="text-center mb-6 text-white">
                            <h2 className="text-2xl font-bold">{plan.name}</h2>
                            <h3 className="text-lg text-secondary-400 mt-2 h-28">{plan.description}</h3>
                            <h3 className="text-7xl font-bold mt-10">{plan.price}</h3>
                            <h3 className="text-lg font-semibold mt-4">One Time Purchase for</h3>
                            <h3 className="text-lg font-semibold mt-1 mb-10">{plan.tokens.toLocaleString()} Tokens.</h3>
                        </div>

                        <div className="w-full mt-auto">
                            <Button
                                label={"Get Started"}
                                onClick={() => handleGetStartedClick(plan.id)}
                                color="primary"
                                fullWidth={true}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
            <WalletConnectModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)}/>
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                plans={plans}
                initialPlanId={selectedPlanId}
            />
        </motion.section>
    );
};

export default PlanSection;