import {Html, Head, Main, NextScript} from 'next/document';
import React from "react";

export default function Document() {
    const APP_NAME = "VeoI3 - AI Video Generation";
    const APP_URL = "https://veoi3.app";
    const APP_DESCRIPTION = "Generate stunning, high-quality videos from simple text or images using cutting-edge generative AI. Integrated with Web3 for a seamless creative economy.";

    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="description" content={APP_DESCRIPTION}/>
                <meta name="keywords"
                      content="AI Video Generator, Text to Video, Image to Video, Generative AI, Veo AI, Vertex AI, Web3, Crypto Payment"/>
                <meta name="author" content="fnrafa"/>
                <link rel="canonical" href={APP_URL}/>

                <link rel="icon" href="/favicon.ico" sizes="any"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <meta name="theme-color" content="#0a0a0a"/>
                <meta name="color-scheme" content="dark"/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content={APP_URL}/>
                <meta property="og:title" content={APP_NAME}/>
                <meta property="og:description" content={APP_DESCRIPTION}/>
                <meta property="og:site_name" content="VeoI3"/>
                <meta property="og:image" content={`${APP_URL}/og-image.png`}/>
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="630"/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:url" content={APP_URL}/>
                <meta name="twitter:title" content={APP_NAME}/>
                <meta name="twitter:description" content={APP_DESCRIPTION}/>
                <meta name="twitter:image" content={`${APP_URL}/og-image.png`}/>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                      rel="stylesheet"/>
            </Head>
            <body className="bg-black text-white antialiased">
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}