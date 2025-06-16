import React, {useState, useEffect, useRef} from "react";
import GenerationForm from "@/components/studio/GenerationForm";
import ResultDisplay from "@/components/studio/ResultDisplay";
import {useAlert} from "@/context/Alert";
import api from "@/utils/axios";
import MainLayout from "@/components/layout/MainLayout";

type JobStatus = 'idle' | 'processing' | 'completed' | 'failed';

const MAX_POLL_RETRIES = 3;

const StudioPage: React.FC = () => {
    const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
    const [finalResult, setFinalResult] = useState<any>(null);
    const [pollRetries, setPollRetries] = useState<number>(0);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const alert = useAlert();

    const startPolling = (resultId: string) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const response = await api.get(`/video/results/${resultId}`);
                const result = response.data.data;
                setPollRetries(0);

                if (result.status === 'COMPLETED' || result.status === 'FAILED') {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    setJobStatus(result.status.toLowerCase());
                    setFinalResult(result);
                }
            } catch (error: any) {
                console.warn(`Polling attempt ${pollRetries + 1} failed. Retrying...`, error);
                setPollRetries(prevRetries => prevRetries + 1);

                if (pollRetries + 1 >= MAX_POLL_RETRIES) {
                    console.error("Polling failed after multiple retries:", error);
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    setJobStatus('failed');
                    const errorMessage = error.response?.data?.message || "Could not retrieve generation status after multiple attempts.";
                    setFinalResult({ errorMessage });
                }
            }
        }, 10000);
    };

    const handleGenerate = async (formData: any) => {
        setJobStatus('processing');
        setFinalResult(null);
        setPollRetries(0);
        try {
            const response = await api.post('/video/generate', formData);
            const {resultId} = response.data.data;

            setTimeout(() => {
                startPolling(resultId);
            }, 3000);

        } catch (error: any) {
            alert("Error", error.response?.data?.message || "Failed to start generation.", "error");
            setJobStatus('failed');
        }
    };

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);


    return (
        <MainLayout
            headerComponent={<h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Studio</h2>}
        >
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <GenerationForm onGenerate={handleGenerate} isGenerating={jobStatus === 'processing'}/>
                <ResultDisplay jobStatus={jobStatus} videoResult={finalResult}/>
            </div>
        </MainLayout>
    );
};

export default StudioPage;