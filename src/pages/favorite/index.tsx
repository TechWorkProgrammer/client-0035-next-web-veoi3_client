import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import {FiHeart} from "react-icons/fi";
import Button from "@/components/common/Button";
import FavoriteHeader from "@/components/favorite/FavoriteHeader";
import {useRouter} from "next/router";

const FavoritesPage: React.FC = () => {
    const hasFavorites = false;

    const router = useRouter();

    const handleSearch = (term: string) => {
        console.log("Searching favorites for:", term);
    };

    return (
        <MainLayout
            headerComponent={<FavoriteHeader onSearch={handleSearch}/>}
        >
            <div className="w-full">
                {hasFavorites ? (
                    <div></div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center text-center p-12 rounded-2xl min-h-[50vh]">
                        <div className="bg-primary-800 p-4 rounded-full mb-6">
                            <FiHeart className="w-10 h-10 text-accent-400"/>
                        </div>
                        <h4 className="text-2xl font-bold text-white">No Favorites Yet</h4>
                        <p className="text-secondary-400 mt-2 max-w-sm">
                            Click the heart icon on any video in the Explore page to save it here.
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

export default FavoritesPage;