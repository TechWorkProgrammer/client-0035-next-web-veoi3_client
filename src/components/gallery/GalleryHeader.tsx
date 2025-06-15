import React, {useState, useRef, useEffect} from 'react';
import {FaCheck} from 'react-icons/fa';
import Icon from "@/components/common/Icon";

type FilterType = 'default' | 'views' | 'likes';
const GalleryHeader: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('default');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const filterTitles: Record<FilterType, string> = {
        default: 'My Creations',
        views: 'Most Viewed',
        likes: 'Most Liked',
    };

    const filterOptions: { key: FilterType, label: string }[] = [
        {key: 'default', label: 'Newest'},
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

    const selectFilter = (filter: FilterType) => {
        setActiveFilter(filter);
        setIsFilterOpen(false);
        console.log("Gallery filter changed to:", filter);
    };

    return (
        <div className="flex items-center justify-between w-fit gap-4 md:gap-8">
            <div className="flex items-center justify-between gap-4 md:gap-8">
                <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">{filterTitles[activeFilter]}</h2>
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-9 h-9 flex items-center justify-center bg-primary-700 rounded-full transition hover:bg-primary-600"
                    >
                        <Icon className="w-5 h-5" name="filter"/>
                    </button>
                    {isFilterOpen && (
                        <div
                            className="absolute -left-10 top-full mt-2 w-fit md:w-36 bg-primary-800 rounded-lg shadow-xl z-10 p-2">
                            {filterOptions.map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => selectFilter(option.key)}
                                    className={`w-full text-left flex items-center justify-between mt-1 gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-primary-700 ${activeFilter === option.key ? "bg-primary-700" : ""}`}
                                >
                                    {activeFilter === option.key ? <FaCheck className="text-white"/> : <div></div>}
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryHeader;