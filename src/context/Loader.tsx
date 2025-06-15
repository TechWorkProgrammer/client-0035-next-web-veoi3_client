import React, {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Loader from "@/components/common/Loader";

interface LoadingContextType {
    loader: (state: boolean, options?: LoaderOptions) => void;
}

interface LoaderOptions {
    size?: "small" | "medium" | "large";
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoader = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoadingProvider');
    }
    return context.loader;
};

const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [manualLoading, setManualLoading] = useState(false);
    const [loaderOptions, setLoaderOptions] = useState<LoaderOptions>({});
    const router = useRouter();

    const loader = (state: boolean, options?: LoaderOptions) => {
        setManualLoading(state);
        setIsLoading(state);
        if (options) {
            setLoaderOptions(options);
        }
    };

    useEffect(() => {
        const handleStart = () => {
            if (!manualLoading) {
                setIsLoading(true);
                setLoaderOptions({size: "large"});
            }
        };
        const handleComplete = () => {
            if (!manualLoading) {
                setIsLoading(false);
            }
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router, manualLoading]);

    return (
        <LoadingContext.Provider value={{loader}}>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <Loader
                        size={loaderOptions.size || "large"}
                    />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;
