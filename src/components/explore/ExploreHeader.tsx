import React, {useState, useRef, useEffect} from 'react';
import {FiSearch} from 'react-icons/fi';
import {FaCheck} from 'react-icons/fa';
import Icon from "@/components/common/Icon";

export type ExploreFilterType = 'newest' | 'views' | 'likes';

interface ExploreHeaderProps {
    onFilterChange: (filter: ExploreFilterType) => void;
    onSearch: (searchTerm: string) => void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({onFilterChange, onSearch}) => {
    const [activeFilter, setActiveFilter] = useState<ExploreFilterType>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);

    const filterTitles: Record<ExploreFilterType, string> = {
        newest: 'Explore',
        views: 'Most Viewed',
        likes: 'Most Liked',
    };

    const filterOptions: { key: ExploreFilterType, label: string }[] = [
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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterRef]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            onSearch(searchTerm);
        }
    };

    const selectFilter = (filter: ExploreFilterType) => {
        setActiveFilter(filter);
        setIsFilterOpen(false);
        onFilterChange(filter);
    };

    return (
        <div className="flex items-center justify-between w-fill gap-2 md:gap-8">
            <div className="flex items-center justify-between gap-2 md:gap-8">
                <h2 className="text-md md:text-2xl font-semibold whitespace-nowrap">{filterTitles[activeFilter]}</h2>
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-5 h-5 md:w-9 md:h-9 flex items-center justify-center bg-primary-700 rounded-full transition hover:bg-primary-600"
                    >
                        <Icon className="h-3 w-3 md:w-5 md:h-5" name="filter"/>
                    </button>
                    {isFilterOpen && (
                        <div
                            className="absolute left-0 top-full mt-2 w-36 bg-primary-800 rounded-lg shadow-xl z-10 p-2">
                            {filterOptions.map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => selectFilter(option.key)}
                                    className={`w-full text-left flex items-center justify-between mt-1 gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-primary-700 ${activeFilter === option.key ? "text-white" : "text-secondary-300"}`}
                                >
                                    <span>{option.label}</span>
                                    {activeFilter === option.key && <FaCheck className="text-accent-400"/>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="relative w-full max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"/>
                <input
                    type="text"
                    placeholder="Search prompt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-transparent border-b-2 border-primary-700 focus:border-accent-500 focus:outline-none pl-10 py-1 md:pr-4 md:py-2 transition text-white placeholder-secondary-400 text-sm md:text-md"
                />
            </div>
        </div>
    );
};

export default ExploreHeader;