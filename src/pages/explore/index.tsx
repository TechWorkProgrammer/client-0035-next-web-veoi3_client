import React from "react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import MainLayout from "@/components/layout/MainLayout";

const ExplorePage: React.FC = () => {
    return (
        <MainLayout
            headerComponent={<ExploreHeader />}
        >
            <div className="text-center p-10 bg-background-dark rounded-lg">
                <h3 className="text-2xl font-bold">Discover Creations</h3>
                <p className="text-secondary-400 mt-2">Browse through videos created by our community.</p>
            </div>
        </MainLayout>
    );
};

export default ExplorePage;