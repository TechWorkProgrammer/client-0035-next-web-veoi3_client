import React from "react";
import {motion} from "framer-motion";
import Button from "@/components/common/Button";
import {FaTelegramPlane} from "react-icons/fa";

const TelegramBanner: React.FC = () => {
    return (
        <motion.div
            className="py-8 md:py-16 text-center h-full px-4"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false}}
            transition={{duration: 0.8, ease: "easeOut"}}
        >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                More Comfortable Using Chat? Use Our <span
                className="bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent">Telegram Bot</span>
            </h1>
            <p className="text-secondary-600 text-sm sm:text-lg md:text-xl mb-8">
                Generate AI content with ease directly from Telegram. Convenient, fast, and easy to use.
            </p>

            <div className="flex justify-center items-center mt-4">
                <div className="w-full sm:w-auto">
                    <Button
                        label="Generate on Telegram"
                        onClick={() => window.open("https://t.me/cypherai_bot", "_blank")}
                        icon={<FaTelegramPlane/>}
                        iconPosition="left"
                        color="primary"
                        fullWidth={true}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default TelegramBanner;
