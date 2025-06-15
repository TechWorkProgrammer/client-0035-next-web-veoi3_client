import React, { useState, useEffect, useRef } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import AuthHeader from "@/components/common/AuthHeader";
import GenerationForm from "@/components/studio/GenerationForm";
import ResultDisplay from "@/components/studio/ResultDisplay";
import { useAlert } from "@/context/Alert";
import api from "@/utils/axios";

type JobStatus = 'idle' | 'processing' | 'completed' | 'failed';

const StudioPage: React.FC = () => {
    const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
    const [finalResult, setFinalResult] = useState<any>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const alert = useAlert();

    const startPolling = (resultId: string) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const response = await api.get(`/video/results/${resultId}`);
                const result = response.data.data;

                if (result.status === 'COMPLETED' || result.status === 'FAILED') {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    setJobStatus(result.status.toLowerCase());
                    setFinalResult(result);
                }
            } catch (error) {
                console.error("Polling failed:", error);
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                setJobStatus('failed');
            }
        }, 10000);
    };

    const handleGenerate = async (formData: any) => {
        setJobStatus('processing');
        setFinalResult(null);
        try {
            const response = await api.post('/video/generate', formData);
            const { resultId } = response.data.data;
            startPolling(resultId);
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
        <SidebarLayout>
            <div className="rounded-lg flex-1 flex flex-col p-3 md:px-6">
                <div className="flex flex-row justify-between mb-4 items-center">
                    <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Studio</h2>
                    <AuthHeader onConnectClick={() => {}} onProfileClick={() => {}} onPlanClick={() => {}} onPaymentHistoryClick={() => {}} onDisconnect={() => {}} />
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <GenerationForm onGenerate={handleGenerate} isGenerating={jobStatus === 'processing'}/>
                    <ResultDisplay jobStatus={jobStatus} videoResult={finalResult} />
                </div>
            </div>
        </SidebarLayout>
    );
};

export default StudioPage;