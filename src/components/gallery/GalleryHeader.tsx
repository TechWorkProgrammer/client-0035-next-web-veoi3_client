import React, {useState, useRef, useEffect} from 'react';
import {FaCheck} from 'react-icons/fa';
import Icon from "@/components/common/Icon";

export type FilterSortType = 'newest' | 'views' | 'likes';

interface GalleryHeaderProps {
    onFilterChange: (filter: FilterSortType) => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({onFilterChange}) => {
    const [activeFilter, setActiveFilter] = useState<FilterSortType>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const filterTitles: Record<FilterSortType, string> = {
        newest: 'My Creations',
        views: 'Most Viewed',
        likes: 'Most Liked',
    };

    const filterOptions: { key: FilterSortType, label: string }[] = [
        {key: 'newest', label: 'Newest'},
        {key: 'views', label: 'Most Views'},
        {key: 'likes', label: 'Most Liked'},
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

    const selectFilter = (filter: FilterSortType) => {
        setActiveFilter(filter);
        setIsFilterOpen(false);
        onFilterChange(filter);
    };

    return (
        <div className="flex items-center justify-between w-fill gap-8">
            <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">{filterTitles[activeFilter]}</h2>
            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-9 h-9 flex items-center justify-center bg-primary-700 rounded-full transition hover:bg-primary-600"
                >
                    <Icon className="w-5 h-5" name="filter"/>
                </button>
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-36 bg-primary-800 rounded-lg shadow-xl z-10 p-2">
                        {filterOptions.map(option => (
                            <button
                                key={option.key}
                                onClick={() => selectFilter(option.key)}
                                className={`w-full text-left flex items-end justify-between mt-1 gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-primary-700 ${activeFilter === option.key ? "text-white" : "text-secondary-300"}`}
                            >
                                {activeFilter === option.key ? <FaCheck/> : <p></p>}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryHeader;