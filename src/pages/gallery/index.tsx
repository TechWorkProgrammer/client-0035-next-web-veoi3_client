import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import {FiVideo} from "react-icons/fi";
import Button from "@/components/common/Button";
import {useRouter} from "next/router";

const GalleryPage: React.FC = () => {
    const router = useRouter();
    const hasVideos = false;

    return (
        <MainLayout
            headerComponent={<GalleryHeader/>}
        >
            <div className="flex justify-start mb-4">
                <h3 className="text-xl font-semibold text-white">Today</h3>
            </div>

            <div className="w-full">
                {hasVideos ? (
                    <div>{/* Video grid goes here */}</div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center text-center p-12 bg-primary-900 border-2 border-dashed border-primary-700 rounded-2xl min-h-[50vh]">
                        <div className="bg-primary-800 p-4 rounded-full mb-6">
                            <FiVideo className="w-10 h-10 text-accent-400"/>
                        </div>
                        <h4 className="text-2xl font-bold text-white">No Creations Yet</h4>
                        <p className="text-secondary-400 mt-2 max-w-sm">
                            Your personal gallery is empty. Head over to the studio to generate your first AI video!
                        </p>
                        <div className="mt-8">
                            <Button label="Go to Studio" color="primary" onClick={() => router.push("/studio")}/>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default GalleryPage;