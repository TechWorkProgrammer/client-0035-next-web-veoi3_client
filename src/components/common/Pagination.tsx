import React from "react";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

interface PaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    setItemsPerPage: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   setCurrentPage,
                                                   totalItems,
                                                   itemsPerPage,
                                                   setItemsPerPage
                                               }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

    const getPagination = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }
        return pages;
    };


    return (
        <div className="w-full flex flex-row items-end justify-between mt-6 space-y-4">
            <div className="flex items-center space-x-2">
                <button
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
                        currentPage === 1
                            ? "bg-primary-900 text-secondary-500 cursor-not-allowed"
                            : "bg-primary-800 text-white hover:bg-accent-500"
                    }`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <AiOutlineLeft className="w-5 h-5"/>
                </button>

                {getPagination().map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="px-2 text-secondary-400">...</span>
                    ) : (
                        <button
                            key={index}
                            className={`w-9 h-9 rounded-lg font-medium transition ${
                                currentPage === page
                                    ? "bg-accent-400 text-white shadow-md"
                                    : "bg-primary-800 text-secondary-400 hover:bg-primary-700"
                            }`}
                            onClick={() => setCurrentPage(Number(page))}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
                        currentPage === totalPages
                            ? "bg-primary-900 text-secondary-500 cursor-not-allowed"
                            : "bg-primary-800 text-white hover:bg-accent-500"
                    }`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <AiOutlineRight className="w-5 h-5"/>
                </button>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-secondary-400">Show</span>
                <select
                    className="bg-primary-700 text-white p-2 px-4 rounded-lg cursor-pointer appearance-none border border-primary-500 hover:border-accent-500 focus:outline-none transition"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <span className="text-secondary-400">per page</span>
            </div>
        </div>
    );
};

export default Pagination;
