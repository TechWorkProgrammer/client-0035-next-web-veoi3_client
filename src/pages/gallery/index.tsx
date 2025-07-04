import React, {useState, useEffect, useCallback} from "react";
import MainLayout from "@/components/layout/MainLayout";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import VideoCard from "@/components/gallery/VideoCard";
import {FiVideo} from "react-icons/fi";
import Button from "@/components/common/Button";
import {useRouter} from "next/router";
import api from "@/utils/axios";
import Loader from "@/components/common/Loader";
import {useAlert} from "@/context/Alert";
import {useWallet} from "@/context/Wallet";
import {useGeneration} from "@/context/Generation";

const GalleryPage: React.FC = () => {
    const router = useRouter();
    const alert = useAlert();
    const {connectedWallet} = useWallet();
    const {generatingJobs} = useGeneration();

    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVideos = useCallback(async () => {
        if (!connectedWallet) {
            setVideos([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.get("/video/my-creations", {params: {limit: 50}});
            setVideos(res.data.data.videos);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to load your videos.";
            alert("Loading Failed", msg, "error");
        } finally {
            setIsLoading(false);
        }
    }, [connectedWallet, alert]);

    useEffect(() => {
        fetchVideos().then();
    }, [fetchVideos]);

    const renderContent = () => {
        if (!connectedWallet) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                    <div className="bg-background-light p-4 rounded-full mb-6">
                        <FiVideo className="w-10 h-10 text-accent-400"/>
                    </div>
                    <h4 className="text-2xl font-bold text-white">Connection Needed</h4>
                    <p className="text-secondary-400 mt-2 max-w-sm">
                        You need to connect wallet to access this feature
                    </p>
                </div>
            );
        }

        if (isLoading && videos.length === 0 && generatingJobs.length === 0) {
            return (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader/>
                </div>
            );
        }

        if (videos.length === 0 && generatingJobs.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                    <div className="bg-background-light p-4 rounded-full mb-6">
                        <FiVideo className="w-10 h-10 text-accent-400"/>
                    </div>
                    <h4 className="text-2xl font-bold text-white">No Creations Yet</h4>
                    <p className="text-secondary-400 mt-2 max-w-sm">
                        Your gallery is empty, open the studio and generate your first video!
                    </p>
                    <div className="mt-8">
                        <Button label="Go to Studio" color="primary" onClick={() => router.push("/studio")}/>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {generatingJobs.map((job) => (
                    <VideoCard
                        key={job.jobId}
                        video={{id: job.jobId, prompt: job.prompt}}
                        isProcessing={true}
                    />
                ))}

                {videos.map((video) => (
                    <VideoCard key={video.id} video={video}/>
                ))}
            </div>
        );
    };

    return (
        <MainLayout headerComponent={<GalleryHeader/>}>
            <div className="flex justify-start mb-6">
                <h3 className="text-xl font-semibold text-white">All My Videos</h3>
            </div>
            <div className="w-full">{renderContent()}</div>
        </MainLayout>
    );
};

export default GalleryPage;