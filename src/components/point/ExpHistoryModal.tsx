import React, {useState, useEffect, useCallback, useRef} from 'react';
import {format} from 'date-fns';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import {useAlert} from '@/context/Alert';
import api from '@/utils/axios';

interface IExpHistory {
    id: string;
    type: 'EARN_SUCCESS_GENERATE' | 'ADJUSTMENT_EXP';
    amount: number;
    description: string;
    createdAt: string;
}

const typeStyles = {
    EARN_SUCCESS_GENERATE: {
        title: 'EXP Reward',
    },
    ADJUSTMENT_EXP: {
        title: 'EXP Adjustment',
    },
};

const ExpHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    const [history, setHistory] = useState<IExpHistory[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const alert = useAlert();

    const fetchHistory = useCallback(async (pageNum: number) => {
        setIsFetchingMore(true);

        try {
            const response = await api.get('/user/me/exp-history', {
                params: {page: pageNum, limit: 10}
            });

            const {history: newHistory, pagination} = response.data.data;

            setHistory(newHistory);
            setHasMore(pagination.currentPage < pagination.totalPages);

        } catch (error: any) {
            alert("Error", "Failed to fetch EXP history. - " + error.message, "error");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [alert]);

    useEffect(() => {
        if (!isOpen) return;
        setHistory([]);
        setPage(1);
        setHasMore(true);
        fetchHistory(1).then();
    }, [fetchHistory, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && hasMore && !isFetchingMore) {
                    setPage(prev => prev + 1);
                }
            },
            {threshold: 1.0}
        );

        const currentObserverRef = observerRef.current;
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [hasMore, isFetchingMore, isOpen]);

    useEffect(() => {
        if (!isOpen || page === 1) return;
        fetchHistory(page).then();
    }, [page, isOpen, fetchHistory]);

    if (!isOpen) {
        return null;
    }

    return (
        <Modal title="Coin History" onClose={onClose}>
            <div className="max-h-[70vh] overflow-y-auto pr-2 px-2">
                <p className="text-start text-secondary-500 pb-4 text-sm">Track your Coin earnings from activities and
                    adjustments.</p>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader/></div>
                ) : history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map(item => {
                            const styleInfo = typeStyles[item.type] || typeStyles.ADJUSTMENT_EXP;
                            const isPositive = item.amount > 0;

                            return (
                                <div key={item.id} className="flex items-center justify-between rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-semibold">{styleInfo.title}</p>
                                            <p className="text-xs text-secondary-400">{item.description}</p>
                                            <p className="text-xs text-secondary-500 mt-1">
                                                {format(new Date(item.createdAt), 'MMM d, yyyy - h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-bold text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{item.amount}
                                    </p>
                                </div>
                            );
                        })}
                        <div ref={observerRef} className="h-10 flex justify-center items-center">
                            {isFetchingMore && <Loader size="small"/>}
                            {!hasMore && <p className="text-sm text-secondary-500">You&#39;ve reached the end.</p>}
                        </div>
                    </div>
                ) : (
                    <p className="text-center py-10 text-secondary-500">No Coin history found.</p>
                )}
            </div>
        </Modal>
    );
};

export default ExpHistoryModal;