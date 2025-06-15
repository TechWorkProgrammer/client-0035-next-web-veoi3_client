import React from "react";

interface LoaderProps {
    size?: "small" | "medium" | "large";
}

const Loader: React.FC<LoaderProps> = ({ size = "medium" }) => {
    const sizeClass =
        size === "small"
            ? "w-6 h-6 border-2"
            : size === "large"
                ? "w-24 h-24 border-8"
                : "w-12 h-12 border-4";

    return (
        <div role="status" className="flex justify-center items-center">
            <div
                className={`
                    rounded-full 
                    animate-spin 
                    border-solid 
                    border-primary-800 
                    border-t-accent-400 
                    ${sizeClass}
                `}
            >
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;