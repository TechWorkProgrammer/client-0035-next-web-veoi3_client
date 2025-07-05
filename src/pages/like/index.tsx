import React, {useState, useEffect, useCallback, useRef} from "react";
import MainLayout from "@/components/layout/MainLayout";
import {FiHeart} from "react-icons/fi";
import Button from "@/components/common/Button";
import {useRouter} from "next/router";
import api from "@/utils/axios";
import {useWallet} from "@/context/Wallet";
import {useAlert} from "@/context/Alert";
import Loader from "@/components/common/Loader";
import VideoCard from "@/components/gallery/VideoCard";
import {getAccessToken} from "@/utils/user";
import LikeHeader from "@/components/like/LikeHeader";

const LikesPage: React.FC = () => {
    const router = useRouter();
    const alert = useAlert();
    const alertRef = useRef(alert);
    useEffect(() => {
        alertRef.current = alert;
    }, [alert]);

    const {connectedWallet} = useWallet();
    const isAuthenticated = !!getAccessToken();

    const [videos, setVideos] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchFavorites = useCallback(
        async (pageNum = 1) => {
            if (!isAuthenticated) {
                setVideos([]);
                setIsLoading(false);
                setIsFetchingMore(false);
                return;
            }

            if (pageNum === 1) {
                setIsLoading(true);
            } else {
                setIsFetchingMore(true);
            }

            try {
                const res = await api.get("/video/favorites", {
                    params: {page: pageNum, limit: 50},
                });
                const {videos: newVideos, pagination} = res.data.data;
                setTotalPages(pagination.totalPages);

                if (pageNum === 1) {
                    setVideos(newVideos);
                } else {
                    setVideos((prev) => [...prev, ...newVideos]);
                }
                setPage(pagination.currentPage);
            } catch (err: any) {
                const msg = err.response?.data?.message || "Failed to load favorites.";
                alertRef.current("Error", msg, "error");
            } finally {
                setIsLoading(false);
                setIsFetchingMore(false);
            }
        },
        [isAuthenticated]
    );

    useEffect(() => {
        if (connectedWallet && isAuthenticated) {
            setVideos([]);
            setPage(1);
            setTotalPages(1);
            fetchFavorites(1).then();
        } else {
            setVideos([]);
            setPage(1);
            setTotalPages(1);
        }
    }, [connectedWallet, isAuthenticated, fetchFavorites]);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    !isFetchingMore &&
                    page < totalPages
                ) {
                    fetchFavorites(page + 1).then();
                }
            },
            {rootMargin: "200px"}
        );
        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [page, totalPages, isFetchingMore, fetchFavorites]);

    const renderContent = () => {
        if (!connectedWallet) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                    <div className="bg-primary-800 p-4 rounded-full mb-6">
                        <FiHeart className="w-10 h-10 text-accent-400"/>
                    </div>
                    <h4 className="text-2xl font-bold text-white">Connection Needed</h4>
                    <p className="text-secondary-400 mt-2 max-w-sm">
                        Please connect your wallet to see your liked videos.
                    </p>
                </div>
            );
        }

        if (isLoading && page === 1) {
            return (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader/>
                </div>
            );
        }

        if (videos.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                    <div className="bg-primary-800 p-4 rounded-full mb-6">
                        <FiHeart className="w-10 h-10 text-accent-400"/>
                    </div>
                    <h4 className="text-2xl font-bold text-white">No Like Yet</h4>
                    <p className="text-secondary-400 mt-2 max-w-sm">
                        Click the heart icon on any video to save it here.
                    </p>
                    <div className="mt-8">
                        <Button
                            label="Go to Studio"
                            color="primary"
                            onClick={() => router.push("/studio")}
                        />
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video}/>
                    ))}
                </div>
                <div ref={loadMoreRef} className="h-8 flex justify-center items-center">
                    {isFetchingMore && <Loader size="small"/>}
                </div>
            </>
        );
    };

    return (
        <MainLayout headerComponent={<LikeHeader/>}>
            <div className="w-full">{renderContent()}</div>
        </MainLayout>
    );
};

export default LikesPage;
