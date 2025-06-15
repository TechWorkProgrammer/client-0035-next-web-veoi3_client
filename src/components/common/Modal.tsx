import React from "react";
import {FaTimes} from "react-icons/fa";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({onClose, children, title = ""}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
            <div
                className="bg-background-dark rounded-lg shadow-lg p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-xl font-semibold text-white ml-2">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="text-white"
                    >
                        <FaTimes size={24}/>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
