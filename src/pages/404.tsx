import React from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {FaArrowLeft} from 'react-icons/fa';

const Custom404: React.FC = () => {
    const router = useRouter();

    return (
        <div
            className="flex items-center justify-center h-screen px-4">
            <div
                className="text-center space-y-6 p-6 md:p-8 max-w-md w-full">
                <div className="flex justify-center">
                    <Image
                        src="/icon.png"
                        alt="Lost Icon"
                        width={100}
                        height={100}
                        priority
                    />
                </div>

                <p className="text-xl md:text-2xl font-semibold text-white">
                    Oops! Page Not Found
                </p>
                <p className="text-sm md:text-md text-secondary-300">
                    Looks like you&#39;re lost. Let&#39;s get you back on track.
                </p>
                <div className="flex justify-center w-full">
                    <Button
                        label="Back to Home"
                        onClick={() => router.push('/')}
                        color="primary"
                        icon={<FaArrowLeft size={16}/>}
                        iconPosition="left"
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
};

export default Custom404;
