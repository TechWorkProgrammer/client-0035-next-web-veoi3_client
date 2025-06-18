import React from 'react';


const GalleryHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between w-fill gap-8">
            <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">My Creations</h2>
        </div>
    );
};

export default GalleryHeader;