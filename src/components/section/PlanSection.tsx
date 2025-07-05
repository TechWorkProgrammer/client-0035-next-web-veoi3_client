import React, {useState, useEffect, useCallback, useRef, useMemo} from "react";
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
                description: planFromApi.description ||
                    "Perfect for starting your AI video creation journey.",
                price: `$${parseFloat(planFromApi.price).toFixed(0)}`,
                tokens: planFromApi.tokens,
            }));

            transformedPlans.push({
                id: "custom",
                name: "Enterprise",
                description: "Tailored solutions for large-scale operations.",
                price: "$500",
                tokens: 5000,
            });

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

    const basicPlan = useMemo(() => plans.find(p => p.id !== 'custom'), [plans]);
    const basicCostPerToken = useMemo(() => {
        if (!basicPlan) return 0;
        const priceNum = Number(basicPlan.price.replace('$', ''));
        return priceNum / basicPlan.tokens;
    }, [basicPlan]);

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-screen-2xl mx-auto z-10 items-center">
                {plans.map((plan) => {
                    const isCustom = plan.id === 'custom';
                    const priceNum = isCustom
                        ? plan.tokens / 10
                        : Number(plan.price.replace('$', ''));
                    const costPerToken = priceNum / plan.tokens;
                    const savings = !isCustom && basicCostPerToken
                        ? Math.round((1 - costPerToken / basicCostPerToken) * 100)
                        : isCustom && basicCostPerToken
                            ? Math.round((1 - costPerToken / basicCostPerToken) * 100)
                            : 0;

                    return (
                        <motion.div
                            key={plan.id}
                            className="bg-background-dark p-8 rounded-3xl shadow-xl hover:scale-105 transform transition duration-300 max-w-sm flex flex-col justify-between"
                        >
                            <div className="text-center my-6 text-white">
                                <h2 className="text-2xl font-bold">{plan.name}</h2>
                                <h3 className="text-lg text-secondary-400 mt-2 h-28">{plan.description}</h3>
                                <h3 className="text-5xl font-bold mt-10">
                                    {isCustom && (<span>&ge;</span>)}{plan.price}
                                </h3>
                                {isCustom ? (
                                    <h3 className="text-lg font-semibold mt-4">Start form</h3>
                                ) : (
                                    <h3 className="text-lg font-semibold mt-4">One Time Purchase for</h3>
                                )}

                                <h3 className="text-lg font-semibold mt-1 mb-2">
                                    {plan.tokens.toLocaleString()}+ Tokens
                                </h3>

                            </div>

                            <div className="w-full mt-8">
                                <div className="flex flex-row justify-center items-center gap-4 mb-4">
                                    <h3 className="text-base">
                                        {costPerToken.toFixed(2)}$/token
                                    </h3>
                                    {plan.id !== basicPlan?.id && (
                                        <h3 className="text-sm font-medium text-secondary-500 bg-primary-100 px-2 py-1 rounded-full">
                                            Save ~{savings}%
                                        </h3>
                                    )}
                                </div>
                                <Button
                                    label="Get Started"
                                    onClick={() => handleGetStartedClick(plan.id)}
                                    color="primary"
                                    fullWidth
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <WalletConnectModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
            />
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
