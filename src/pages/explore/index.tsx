import React, {useState, useEffect, useCallback, useRef} from "react";
import {useInView} from 'react-intersection-observer';
import MainLayout from "@/components/layout/MainLayout";
import ExploreHeader, {ExploreFilterType} from "@/components/explore/ExploreHeader";
import ExploreVideoCard from "@/components/explore/ExploreVideoCard";
import api from "@/utils/axios";
import Loader from "@/components/common/Loader";
import {useAlert} from "@/context/Alert";

const ExplorePage: React.FC = () => {
    const alert = useAlert();
    const alertRef = useRef(alert);
    useEffect(() => {
        alertRef.current = alert;
    }, [alert]);

    const [videos, setVideos] = useState<any[]>([]);
    const [filter, setFilter] = useState<ExploreFilterType>('newest');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const {ref, inView} = useInView({threshold: 0.5});

    const fetchVideos = useCallback(async (currentPage: number, currentFilter: ExploreFilterType) => {
        setIsLoading(true);
        try {
            const response = await api.get('/video/', {
                params: {sortBy: currentFilter, page: currentPage, limit: 12}
            });
            const newVideos = response.data.data.videos;
            setVideos(prev => currentPage === 1 ? newVideos : [...prev, ...newVideos]);
            setHasMore(newVideos.length > 0);
        } catch (err: any) {
            alertRef.current(
                'Loading Failed',
                err.response?.data?.message || "Failed to load explore videos.",
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setVideos([]);
        setPage(1);
        setHasMore(true);
        fetchVideos(1, filter).then();
    }, [filter, fetchVideos]);

    useEffect(() => {
        if (inView && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [inView, isLoading, hasMore]);

    useEffect(() => {
        if (page > 1) {
            fetchVideos(page, filter).then();
        }
    }, [page, filter, fetchVideos]);

    const handleFilterChange = (newFilter: ExploreFilterType) => {
        if (newFilter !== filter) {
            setFilter(newFilter);
        }
    };

    return (
        <MainLayout headerComponent={<ExploreHeader onFilterChange={handleFilterChange}/>}>
            <div className="w-full columns-1 md:columns-2 lg:columns-3 gap-x-4 gap-y-4">
                {videos.map((video, idx) => (
                    <ExploreVideoCard key={`${video.id}-${idx}`} video={video}/>
                ))}
            </div>

            <div ref={ref} className="flex justify-center items-center h-40">
                {isLoading && <Loader/>}
                {!hasMore && videos.length > 0 && (
                    <p className="text-secondary-400">You&#39;ve reached the end!</p>
                )}
            </div>

            {!isLoading && videos.length === 0 && (
                <div className="text-center p-10">
                    <h3 className="text-2xl font-bold">No Videos Found</h3>
                    <p className="text-secondary-400 mt-2">Try a different filter or check back later.</p>
                </div>
            )}
        </MainLayout>
    );
};

export default ExplorePage;
