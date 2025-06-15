import React, {useState, useRef, useEffect} from 'react';
import {FiSearch} from 'react-icons/fi';
import {FaCheck} from 'react-icons/fa';
import Icon from "@/components/common/Icon";

type FilterType = 'default' | 'views' | 'likes';

const ExploreHeader: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('default');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);

    const filterTitles: Record<FilterType, string> = {
        default: 'Explore',
        views: 'Top',
        likes: 'Likes',
    };

    const filterOptions: { key: FilterType, label: string }[] = [
        {key: 'default', label: 'Default'},
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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log("Searching for:", searchTerm);
        }
    };

    const selectFilter = (filter: FilterType) => {
        setActiveFilter(filter);
        setIsFilterOpen(false);
        console.log("Filter changed to:", filter);
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

            <div className="relative w-24 md:w-36 lg:w-48">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-200"/>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-transparent border-b-2 text-white border-primary-500 focus:border-accent-500 focus:outline-none pl-10 pr-4 py-2 transition placeholder-secondary-200"
                />
            </div>
        </div>
    );
};

export default ExploreHeader;