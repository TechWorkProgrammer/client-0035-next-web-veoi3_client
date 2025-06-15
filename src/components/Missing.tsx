import React from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {FaArrowLeft} from 'react-icons/fa';

const Missing: React.FC = () => {
    const router = useRouter();

    return (
        <div
            className="flex items-center justify-center min-h-[50vh] px-4">
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
                    Oops! This data isn’t available yet.
                </p>
                <p className="text-sm md:text-md text-secondary-300">
                    It could still be processing or the link might be broken.
                </p>
                <div className="flex justify-center w-full">
                    <Button
                        label="Back to Discover"
                        onClick={() => router.push('/discover')}
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

export default Missing;
