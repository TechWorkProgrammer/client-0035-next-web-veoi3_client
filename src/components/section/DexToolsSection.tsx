import React, {useState} from "react";
import {motion} from "framer-motion";
import {PiCopySimpleBold} from "react-icons/pi";

const DexToolsSection: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const address = "0xBF03A8fF17Bc0784feFa8680B9f701C98c8d8189";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <section id="dextools" className="relative w-full py-16 flex flex-col items-center text-white z-20">
            <motion.h5
                className="text-sm font-semibold text-secondary-600 text-center tracking-widest uppercase"
                initial={{opacity: 0, y: -20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false}}
                transition={{duration: 0.6}}
            >
                DexTools
            </motion.h5>
            <motion.h1
                className="text-4xl md:text-5xl font-bold my-4 text-white text-center max-w-6xl"
                initial={{opacity: 0, y: -10}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false}}
                transition={{duration: 0.6, delay: 0.1}}
            >
                Track movement and swap directly on DexTools
            </motion.h1>

            <div className="w-full max-w-7xl px-4 my-4">
                <iframe
                    id="dextools-widget"
                    title="DEXTools Trading Chart"
                    src="https://www.dextools.io/widget-chart/en/ether/pe-light/0xb031db1f57d90727b813f875bdcf840d4af6f29f?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false"
                    className="w-full h-72 md:h-[500px] lg:h-[600px] rounded-lg shadow-lg"
                />
            </div>

            <div className="relative w-full max-w-2xl px-4 mt-6 text-md md:text-lg">
                <input
                    type="text"
                    value={address}
                    disabled
                    className="block w-full bg-background-light rounded-xl py-2 px-3 text-white focus:outline-none cursor-not-allowed"
                />
                <div
                    className="absolute inset-y-0 right-4 flex items-center pr-3 cursor-pointer"
                    onClick={copyToClipboard}
                >
                    <PiCopySimpleBold
                        className={`text-secondary-400 hover:text-white transition ${copied ? 'text-accent-500' : ''}`}
                    />
                </div>
            </div>
        </section>
    );
};

export default DexToolsSection;
