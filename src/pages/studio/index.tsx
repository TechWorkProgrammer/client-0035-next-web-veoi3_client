import React, {useEffect, useState} from "react";
import GenerationForm from "@/components/studio/GenerationForm";
import ResultDisplay from "@/components/studio/ResultDisplay";
import MainLayout from "@/components/layout/MainLayout";
import {useGeneration} from "@/context/Generation";

type JobStatus = 'idle' | 'processing' | 'completed' | 'failed';

const StudioPage: React.FC = () => {
    const {startGeneration, generatingJobs, lastCompletedJob, clearLastCompletedJob} = useGeneration();

    const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
    const [finalResult, setFinalResult] = useState<any>(null);

    const handleGenerate = async (formData: any) => {
        setJobStatus('processing');
        setFinalResult(null);
        await startGeneration(formData);
    };

    useEffect(() => {
        if (generatingJobs.length > 0) {
            setJobStatus('processing');
        } else if (jobStatus === 'processing' && !lastCompletedJob) {
            setJobStatus('idle');
        }
    }, [generatingJobs, jobStatus, lastCompletedJob]);

    useEffect(() => {
        if (lastCompletedJob) {
            setJobStatus('completed');
            setFinalResult(lastCompletedJob);
            clearLastCompletedJob();
        }
    }, [lastCompletedJob, clearLastCompletedJob]);


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