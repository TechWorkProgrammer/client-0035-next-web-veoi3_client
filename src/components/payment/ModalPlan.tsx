import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {FaTimes} from "react-icons/fa";
import PlanSection from "@/components/section/PlanSection";

interface ModalPlanProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalPlan: React.FC<ModalPlanProps> = ({isOpen, onClose}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className="relative w-full h-full"
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 md:top-8 md:left-8 z-40 text-white bg-black/30 rounded-full hover:bg-black/50 transition"
                            aria-label="Close"
                        >
                            <FaTimes size={20}/>
                        </button>
                        <div className="w-full h-full overflow-y-auto">
                            <PlanSection/>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalPlan;