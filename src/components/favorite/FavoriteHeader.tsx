import React, {useState, useEffect} from 'react';
import {FiSearch} from 'react-icons/fi';

interface SimpleHeaderProps {
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
}

const FavoriteHeader: React.FC<SimpleHeaderProps> = ({onSearch, placeholder = "Search..."}) => {
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
        <div className="flex items-center justify-between w-full gap-4">
            <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Favorite</h2>
            <div className="relative w-full max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"/>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-primary-800 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
            </div>
        </div>
    );
};

export default FavoriteHeader;