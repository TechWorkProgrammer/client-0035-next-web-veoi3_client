import React from 'react';

const FavoriteHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between w-fill gap-8">
            <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Favorite</h2>
        </div>
    );
};

export default FavoriteHeader;