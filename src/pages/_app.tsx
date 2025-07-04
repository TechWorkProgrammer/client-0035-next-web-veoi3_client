import '@/styles/globals.css';
import {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import HeadTitle from '@/components/HeadTitle';
import LoadingProvider from '@/context/Loader';
import {AlertProvider} from '@/context/Alert';
import {WalletProvider} from '@/context/Wallet';

import {Inter} from 'next/font/google';
import {NotificationProvider} from '@/context/Notification';
import {GenerationProvider} from "@/context/Generation";

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

function MyApp({Component, pageProps}: AppProps) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return (
        <LoadingProvider>
            <AlertProvider>
                <WalletProvider>
                    <NotificationProvider>
                        <GenerationProvider>
                            <HeadTitle/>
                            <div className={`flex flex-col min-h-screen ${inter.variable}`}>
                                <Component {...pageProps} />
                            </div>
                        </GenerationProvider>
                    </NotificationProvider>
                </WalletProvider>
            </AlertProvider>
        </LoadingProvider>
    );
}

export default MyApp;
