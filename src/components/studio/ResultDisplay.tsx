import React from 'react';
import Loader from '@/components/common/Loader';
import {FaCirclePlay} from "react-icons/fa6";

interface ResultDisplayProps {
    jobStatus: 'idle' | 'processing' | 'completed' | 'failed';
    videoResult: any;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({jobStatus, videoResult}) => {
    return (
        <div className="bg-primary-900 rounded-lg h-full min-h-[60vh] flex items-center justify-center p-4">
            {jobStatus === 'idle' && (
                <div className="flex flex-col text-center justify-center items-center text-secondary-500">
                    <FaCirclePlay size={56}/>
                    <p className="mt-4">Your generated video will appear here.</p>
                    <p>generate a video to see the preview in this area</p>
                </div>
            )}
            {jobStatus === 'processing' && (
                <div className="flex flex-col text-center justify-center items-center">
                    <Loader/>
                    <p className="mt-4 text-white">Generating your video...</p>
                    <p className="text-sm text-secondary-400">This may take a few minutes. You can leave this page.</p>
                </div>
            )}
            {jobStatus === 'failed' && (
                <div className="text-center text-red-500">
                    <p>Generation Failed</p>
                    <p className="text-sm">{videoResult?.errorMessage || 'An unknown error occurred.'}</p>
                </div>
            )}
            {jobStatus === 'completed' && videoResult?.videoFiles?.[0]?.videoUrl && (
                <video src={videoResult.videoFiles[0].videoUrl} controls autoPlay loop
                       className="w-full h-full object-contain rounded-lg"/>
            )}
        </div>
    );
};

export default ResultDisplay;