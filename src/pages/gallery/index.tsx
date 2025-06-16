import React, {useState, useEffect} from "react";
import MainLayout from "@/components/layout/MainLayout";
import GalleryHeader, {FilterSortType} from "@/components/gallery/GalleryHeader";
import VideoCard from "@/components/gallery/VideoCard";
import {FiVideo} from "react-icons/fi";
import Button from "@/components/common/Button";
import {useRouter} from "next/router";
import api from "@/utils/axios";
import Loader from "@/components/common/Loader";
import {useAlert} from "@/context/Alert";

const GalleryPage: React.FC = () => {
    const router = useRouter();
    const alert = useAlert();

    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filter, setFilter] = useState<FilterSortType>('newest');

    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/video/my-creations', {
                    params: {
                        sortBy: filter,
                        limit: 20
                    }
                });
                setVideos(response.data.data.videos);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Failed to load your videos.";
                alert('Loading Failed', errorMessage, 'error');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos().then();
    }, [alert, filter]);

    const handleFilterChange = (newFilter: FilterSortType) => {
        setFilter(newFilter);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader/>
                </div>
            );
        }

        if (videos.length === 0) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video}/>
                ))}
            </div>
        );
    };

    return (
        <MainLayout
            headerComponent={<GalleryHeader onFilterChange={handleFilterChange}/>}
        >
            <div className="flex justify-start mb-6">
                <h3 className="text-xl font-semibold text-white">All My Videos</h3>
            </div>
            <div className="w-full">
                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default GalleryPage;