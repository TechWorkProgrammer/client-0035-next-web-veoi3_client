import React, {createContext, useState, useContext, useRef, useEffect, useCallback} from 'react';
import api from '@/utils/axios';
import {useWallet} from '@/context/Wallet';
import {useAlert} from '@/context/Alert';
import {Video} from '@/components/gallery/VideoModal';

export interface GeneratingJob extends Partial<Video> {
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    prompt: string;
    errorMessage?: string;
}

interface GenerationContextType {
    generatingJobs: GeneratingJob[];
    startGeneration: (formData: FormData) => Promise<void>;
    lastCompletedJob: GeneratingJob | null;
    clearLastCompletedJob: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

const MAX_POLL_RETRIES = 5;

export const GenerationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [generatingJobs, setGeneratingJobs] = useState<GeneratingJob[]>([]);
    const [lastCompletedJob, setLastCompletedJob] = useState<GeneratingJob | null>(null);

    const pollingIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const pollRetries = useRef<Map<string, number>>(new Map());

    const {refreshUser} = useWallet();
    const alert = useAlert();

    const stopPolling = useCallback((jobId: string) => {
        if (pollingIntervals.current.has(jobId)) {
            clearInterval(pollingIntervals.current.get(jobId)!);
            pollingIntervals.current.delete(jobId);
            pollRetries.current.delete(jobId);
        }
    }, []);

    const pollJobStatus = useCallback(async (job: GeneratingJob) => {
        try {
            const response = await api.get(`/video/results/${job.jobId}`);
            const result = response.data.data;
            pollRetries.current.set(job.jobId, 0);

            if (result.status === 'COMPLETED' || result.status === 'FAILED') {
                stopPolling(job.jobId);

                setGeneratingJobs(prevJobs => prevJobs.filter(j => j.jobId !== job.jobId));

                if (result.status === 'COMPLETED') {
                    const completedJob = {...job, ...result, status: 'completed'};
                    setLastCompletedJob(completedJob);
                }

                refreshUser().then();
            }
        } catch (error: any) {
            const currentRetries = (pollRetries.current.get(job.jobId) || 0) + 1;
            pollRetries.current.set(job.jobId, currentRetries);
            console.warn(`Polling attempt ${currentRetries} for ${job.jobId} failed. Retrying...`);

            if (currentRetries >= MAX_POLL_RETRIES) {
                console.error(`Polling for ${job.jobId} failed permanently.`, error);
                stopPolling(job.jobId);
                const errorMessage = error.response?.data?.message || "Could not retrieve generation status.";

                setGeneratingJobs(prevJobs => prevJobs.map(j =>
                    j.jobId === job.jobId ? {...j, status: 'failed', errorMessage} : j
                ));
            }
        }
    }, [stopPolling, refreshUser]);


    const startGeneration = async (formData: FormData) => {
        setLastCompletedJob(null);

        try {
            const response = await api.post('/video/generate', formData);
            const {resultId} = response.data.data;
            const prompt = formData.get('prompt') as string;

            const newJob: GeneratingJob = {
                id: resultId,
                jobId: resultId,
                prompt: prompt,
                status: 'processing',
                videoFiles: [],
                _count: {favorites: 0}
            };

            setGeneratingJobs(prevJobs => [newJob, ...prevJobs]);

            const interval = setInterval(() => pollJobStatus(newJob), 10000);
            pollingIntervals.current.set(resultId, interval);
            pollRetries.current.set(resultId, 0);

        } catch (error: any) {
            alert("Error", error.response?.data?.message || "Failed to start generation.", "error");
        }
    };

    const clearLastCompletedJob = () => {
        setLastCompletedJob(null);
    }

    useEffect(() => {
        return () => {
            pollingIntervals.current.forEach(interval => clearInterval(interval));
        };
    }, []);


    return (
        <GenerationContext.Provider value={{generatingJobs, startGeneration, lastCompletedJob, clearLastCompletedJob}}>
            {children}
        </GenerationContext.Provider>
    );
};

export const useGeneration = () => {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error('useGeneration must be used within a GenerationProvider');
    }
    return context;
};