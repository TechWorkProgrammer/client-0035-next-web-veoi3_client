import React from "react";
import {motion} from "framer-motion";

interface Props {
    label?: string;
    onClick: () => void;
    color?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    disabled?: boolean;
}

const Button: React.FC<Props> = ({
                                     label,
                                     onClick,
                                     color = "primary",
                                     type = "button",
                                     children,
                                     fullWidth = false,
                                     icon,
                                     iconPosition = "left",
                                     disabled = false,
                                 }) => {
    const baseStyles =
        "relative font-semibold flex items-center justify-center gap-2 rounded-full text-sm md:text-md lg:text-lg py-2 px-4 transition-transform duration-300 shadow-md focus:outline-none overflow-hidden";

    const primaryStyles = `bg-white text-black`;

    const secondaryStyles = `bg-transparent text-white border-2 border-accent-400 hover:text-accent-400`;

    const contentStyles = "relative z-10 flex items-center gap-2";

    const disabledStyles = "opacity-50 cursor-not-allowed";

    return (
        <div
            className={`${
                fullWidth ? "w-full" : "w-auto"
            } flex justify-center items-center`}
        >
            <motion.div
                className={`relative ${fullWidth ? "w-full" : "w-auto"} ${
                    disabled ? "pointer-events-none" : ""
                }`}
                whileHover={{scale: disabled ? 1 : 1.05}}
                whileTap={{scale: disabled ? 1 : 0.95}}
            >
                <button
                    onClick={disabled ? undefined : onClick}
                    type={type as "button" | "submit" | "reset"}
                    disabled={disabled}
                    className={`${baseStyles} ${
                        color === "primary" ? primaryStyles : secondaryStyles
                    } ${disabled ? disabledStyles : ""} ${fullWidth ? "w-full" : "w-auto"}`}
                >
                    <span className={contentStyles}>
                        {icon && iconPosition === "left" && <span>{icon}</span>}
                        {children || label}
                        {icon && iconPosition === "right" && <span>{icon}</span>}
                    </span>
                </button>
            </motion.div>
        </div>
    );
};

export default Button;
