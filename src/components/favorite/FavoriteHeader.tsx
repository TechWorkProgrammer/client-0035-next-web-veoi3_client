import React, {useState, useEffect} from 'react';
import {FiSearch} from 'react-icons/fi';

interface SimpleHeaderProps {
    onSearch: (searchTerm: string) => void;
}

const FavoriteHeader: React.FC<SimpleHeaderProps> = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, onSearch]);

    return (
        <div className="flex items-center justify-between w-fill gap-8">
            <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Favorite</h2>
            <div className="relative w-24 md:w-36 lg:w-48">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-200"/>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-b-2 text-white border-primary-500 focus:border-accent-500 focus:outline-none pl-10 pr-4 py-2 transition placeholder-secondary-200"
                />
            </div>
        </div>
    );
};

export default FavoriteHeader;