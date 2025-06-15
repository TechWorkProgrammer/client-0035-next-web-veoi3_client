import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import {FaHome} from "react-icons/fa";
import {useRouter} from "next/router";

const ComingSoon: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div
                className="text-center space-y-6 px-6 py-8 rounded-xl shadow-lg w-full max-w-lg mx-4 md:mx-0">
                <div className="flex justify-center">
                    <Image
                        src="/icon.png"
                        alt="Coming Soon Icon"
                        width={100}
                        height={100}
                        className="object-contain"
                    />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">
                    Coming Soon!
                </p>
                <p className="text-sm md:text-base text-secondary-300 leading-relaxed">
                    We are working hard to bring this feature to you. Stay tuned!
                </p>
                <div className="flex justify-center">
                    <Button
                        label="Back to Home"
                        onClick={() => router.push("/")}
                        color="primary"
                        icon={<FaHome size={16}/>}
                        iconPosition="left"
                    />
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
