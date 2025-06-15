import {FaCheck} from "react-icons/fa";
import React from "react";
import {motion} from "framer-motion";

const features = [
    "Advanced Text-to-Video Generation",
    "Image-to-Video Transformation",
    "Integrated AI Voice & Audio",
    "Fine-Tuning with Negative Prompts",
    "Custom Aspect Ratio & Duration Control",
    "Secure Web3 Wallet Login (MetaMask, etc)",
    "Classic Username/Password Authentication",
    "Real-time Notifications via WebSockets",
    "Customizable User Profiles",
    "Flexible Token-Based System",
    "Cryptocurrency Payments (USDT)",
    "Detailed & Infinite Scroll Payment History",
    "Gamified Point Rewards System",
    "Comprehensive Admin Dashboard & Statistics",
    "Full User and Payment Management Panel",
];

const ScrollingFeatures: React.FC = () => {
    const duplicated = [...features, ...features];

    return (
        <div className="relative w-full overflow-hidden py-4 z-10" style={{
            WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
        }}>
            <motion.div
                className="flex gap-8 whitespace-nowrap w-max"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 240,
                    ease: "linear",
                }}
            >
                {duplicated.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-secondary-300 text-sm font-medium px-2">
                        <FaCheck className="flex-shrink-0"/>
                        <span>{item}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ScrollingFeatures;
