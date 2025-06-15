import React, {useState, useEffect, useRef} from "react";
import GenerationForm from "@/components/studio/GenerationForm";
import ResultDisplay from "@/components/studio/ResultDisplay";
import {useAlert} from "@/context/Alert";
import api from "@/utils/axios";
import MainLayout from "@/components/layout/MainLayout";

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
            const {resultId} = response.data.data;
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