import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import {FiTrash2} from "react-icons/fi";

const TrashPage: React.FC = () => {
    const hasVideosInTrash = false;

    return (
        <MainLayout
            headerComponent={<h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Trash</h2>}
        >
            <div className="w-full">
                {hasVideosInTrash ? (
                    <div></div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                        <div className="bg-primary-800 p-4 rounded-full mb-6">
                            <FiTrash2 className="w-10 h-10 text-accent-400"/>
                        </div>
                        <h4 className="text-2xl font-bold text-white">Trash is Empty</h4>
                        <p className="text-secondary-400 mt-2 max-w-sm">
                            Deleted items are stored here and will be permanently removed after 30 days.
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default TrashPage;