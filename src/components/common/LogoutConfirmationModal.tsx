import React from 'react';
import Modal from "@/components/common/Modal";

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({isOpen, onClose, onConfirm}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal title="Log out Account" onClose={onClose}>
            <div className="space-y-6 px-2">
                <p className="text-white">
                    Are you sure you want to log out of your account? You can always log back in.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-secondary-800/20 text-white text-lg font-semibold px-6 py-1.5 rounded-full transition hover:bg-secondary-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white text-lg font-semibold px-6 py-1.5 rounded-full transition hover:bg-red-700"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutConfirmationModal;