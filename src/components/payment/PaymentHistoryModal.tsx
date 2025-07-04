import React, {useState, useEffect, useCallback, useRef} from 'react';
import Modal from '@/components/common/Modal';
import {useAlert} from '@/context/Alert';
import {format} from 'date-fns';
import Loader from '@/components/common/Loader';
import {IPayment} from "@/types/payment";
import api from "@/utils/axios";

const statusStyles = {
    CONFIRMED: {text: 'text-green-400', label: 'Tokens Received'},
    PENDING: {text: 'text-yellow-400', label: 'Pending Review'},
    REJECTED: {text: 'text-red-400', label: 'Payment Rejected'},
    CANCELLED: {text: 'text-gray-400', label: 'Cancelled'},
};

const PaymentHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const alert = useAlert();

    const fetchHistory = useCallback(async (pageNum: number) => {
        setIsFetchingMore(true);

        try {
            const response = await api.get('/payment/history', {
                params: {page: pageNum, limit: 10}
            });
            const {payments: newPayments, pagination} = response.data.data;
            setPayments(newPayments);
            setHasMore(pagination.currentPage < pagination.totalPages);

        } catch (error: any) {
            alert("Error", "Failed to fetch payment history. - " + error.message, "error");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [alert]);

    useEffect(() => {
        if (!isOpen) return;
        setPayments([]);
        setPage(1);
        setHasMore(true);
        fetchHistory(1).then();
    }, [isOpen, fetchHistory]);

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
        <Modal title="Payment History" onClose={onClose}>
            <div className="max-h-[70vh] overflow-y-auto pr-2 px-2">
                <p className="text-start text-secondary-500 pb-4 text-sm">View details of your credit purchases and
                    top-ups.</p>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40"><Loader/></div>
                ) : payments.length > 0 ? (
                    <div className="space-y-4">
                        {payments.map(payment => (
                            <div key={payment.id}
                                 className="flex items-center justify-between rounded-lg">
                                <div>
                                    <p className="font-semibold">{payment.itemPack?.name || `Customize`}, {payment.itemPack?.tokens || `${payment.customTokenAmount}`} Token</p>
                                    <p className={`text-xs font-medium ${statusStyles[payment.status]?.text || 'text-gray-400'}`}>{statusStyles[payment.status]?.label || payment.status}</p>
                                    <p className="text-xs text-secondary-500 mt-2">{format(new Date(payment.createdAt), 'MMM d, yyyy - h:mm a')}</p>
                                </div>
                                <p className="font-bold text-lg">${Number(payment.totalPrice).toFixed(2)}</p>
                            </div>
                        ))}
                        <div ref={observerRef} className="h-10 flex justify-center items-center">
                            {isFetchingMore && <Loader size="small"/>}
                            {!hasMore && <p className="text-sm text-secondary-500">You&#39;ve reached the end.</p>}
                        </div>
                    </div>
                ) : (
                    <p className="text-center py-10 text-secondary-500">No payment history found.</p>
                )}
            </div>
        </Modal>
    );
};

export default PaymentHistoryModal;