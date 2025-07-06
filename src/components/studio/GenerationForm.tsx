import React, {useState, useMemo, useEffect} from 'react';
import Button from '@/components/common/Button';
import {getUser} from '@/utils/user';
import DropzoneInput from '@/components/common/DropzoneInput';
import {motion, AnimatePresence} from 'framer-motion';
import {FaPlay} from "react-icons/fa";
import {useAlert} from "@/context/Alert";

interface FormData {
    prompt: string;
    negativePrompt: string;
    durationSeconds: number;
    aspectRatio: string;
    sampleCount: number;
    generateAudio: boolean;
    seed: number;
}

interface GenerationFormProps {
    onGenerate: (data: FormData | globalThis.FormData) => void;
    isGenerating: boolean;
}

const TOKENS_PER_SECOND_VIDEO = 10;
const TOKENS_PER_SECOND_AUDIO = 5;
const MAX_FILE_SIZE_BYTES = 972800;
const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/webp";

const aspectRatioOptions = [
    {value: '16:9', label: 'Landscape', icon: <div className="w-10 h-[22.5px] bg-primary-600 rounded-sm"></div>},
    {value: '9:16', label: 'Portrait', icon: <div className="w-[22.5px] h-10 bg-primary-600 rounded-sm"></div>},
    {value: '1:1', label: 'Square', icon: <div className="w-8 h-8 bg-primary-600 rounded-sm"></div>},
];

const initialFormState: FormData = {
    prompt: 'A cinematic shot of a puppy playing in the snow, soft light, 4k',
    negativePrompt: 'blurry, low quality, bad quality',
    durationSeconds: 8,
    aspectRatio: '16:9',
    sampleCount: 1,
    generateAudio: true,
    seed: Math.floor(Math.random() * 1000000),
};

const GenerationForm: React.FC<GenerationFormProps> = ({onGenerate, isGenerating}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [generationMode, setGenerationMode] = useState<'text' | 'image' | 'narration' | 'custom'>('text');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState<FormData>(initialFormState);
    const alert = useAlert();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const user = getUser();

    const requiredTokens = useMemo(() => {
        const baseCost = form.durationSeconds * TOKENS_PER_SECOND_VIDEO;
        const audioCost = form.generateAudio ? form.durationSeconds * TOKENS_PER_SECOND_AUDIO : 0;
        return (baseCost + audioCost) * form.sampleCount;
    }, [form.durationSeconds, form.generateAudio, form.sampleCount]);

    const userToken = user?.user.token || 0;
    const hasEnoughTokens = userToken >= requiredTokens;
    const isReadyToSubmit = hasEnoughTokens && !isGenerating && (generationMode === 'text' || (generationMode === 'image' && imageFile));

    const handleReset = () => {
        setForm(initialFormState);
        setImageFile(null);
        setGenerationMode('text');
    };

    const handleSubmit = async () => {
        if (!isReadyToSubmit) return;
        setSubmitting(true);

        const formDataToSubmit = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formDataToSubmit.append(key, String(value));
        });
        if (generationMode === 'image' && imageFile) {
            formDataToSubmit.append('image', imageFile);
        }

        try {
            onGenerate(formDataToSubmit);
        } catch (e: any) {
            alert("Error", e.message || "Failed to start generation", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-4 gap-2 bg-background-dark p-1 rounded-xl">
                <button onClick={() => setGenerationMode('text')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${generationMode === 'text' ? 'bg-primary-700' : 'bg-transparent text-secondary-400'}`}>Text-to-Video
                </button>
                <button onClick={() => setGenerationMode('image')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${generationMode === 'image' ? 'bg-primary-700' : 'bg-transparent text-secondary-400'}`}>Image-to-Video
                </button>
                <button
                    onClick={() => alert("Coming Soon", "We're working hard on this feature. Stay tuned for updates!", "info")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${generationMode === 'narration' ? 'bg-primary-700' : 'bg-transparent text-secondary-400'}`}>AI
                    Narration & Sound Effects
                </button>
                <button
                    onClick={() => alert("Coming Soon", "We're working hard on this feature. Stay tuned for updates!", "info")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${generationMode === 'custom' ? 'bg-primary-700' : 'bg-transparent text-secondary-400'}`}>Customizable
                    Video Styles
                </button>
            </div>

            <AnimatePresence>
                {generationMode === 'image' && (
                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}}
                                exit={{opacity: 0, height: 0}}>
                        <DropzoneInput label={"Image"} onFileChange={setImageFile} maxSize={MAX_FILE_SIZE_BYTES}
                                       accept={ACCEPTED_IMAGE_TYPES}/>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-secondary-400 mb-2">Prompt</label>
                <textarea id="prompt" value={form.prompt} onChange={e => setForm({...form, prompt: e.target.value})}
                          rows={5}
                          className="block w-full bg-background-dark rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                          required/>
            </div>
            <div>
                <label htmlFor="negativePrompt" className="block text-sm font-medium text-secondary-400 mb-2">Negative
                    Prompt</label>
                <textarea id="negativePrompt" value={form.negativePrompt}
                          onChange={e => setForm({...form, negativePrompt: e.target.value})} rows={2}
                          className="block w-full bg-background-dark rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-400"/>
            </div>

            <div>
                <label className="block text-sm font-medium text-secondary-400 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-3">
                    {aspectRatioOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setForm({...form, aspectRatio: option.value})}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${form.aspectRatio === option.value ? 'border-accent-400 bg-background-dark' : 'border-primary-700 hover:border-primary-600'}`}
                        >
                            {option.icon}
                            <span className="text-xs">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="durationSeconds" className="block text-sm font-medium text-secondary-400 mb-2">Duration
                    ({form.durationSeconds}s)</label>
                <input type="range" id="durationSeconds" min="1" max="8" step="1" value={form.durationSeconds}
                       onChange={e => setForm({...form, durationSeconds: Number(e.target.value)})}
                       className="w-full h-2 bg-primary-700 rounded-lg appearance-none cursor-pointer" disabled={true}/>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="generateAudio" className="text-sm font-medium text-secondary-400">Generate Audio
                    (+{TOKENS_PER_SECOND_AUDIO} tokens/sec)</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="generateAudio" checked={form.generateAudio}
                           onChange={e => setForm({...form, generateAudio: e.target.checked})}
                           className="sr-only peer"/>
                    <div
                        className="w-11 h-6 bg-primary-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-400"></div>
                </label>
            </div>

            <div className="pt-6 border-t border-primary-700 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 text-white bg-secondary-200/50 px-4 py-2 rounded-full text-md font-semibold transition hover:bg-secondary-200/80"
                >
                    Reset
                </button>
                <div className="flex items-center gap-4 w-full">
                    <div className="text-right w-full">
                        {isMounted ? (
                            <>
                                <p className="text-sm font-semibold text-secondary-400">
                                    Token remaining: {userToken.toLocaleString()}
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    This generation will cost: {requiredTokens}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-secondary-400 h-5">Token remaining: ...</p>
                                <p className="text-sm font-semibold text-white h-5">This generation will cost: ...</p>
                            </>
                        )}
                    </div>
                    <Button
                        label={isGenerating ? 'Generating...' : 'Generate'}
                        onClick={handleSubmit}
                        fullWidth
                        disabled={!isMounted || !isReadyToSubmit || submitting}
                        icon={<FaPlay className="w-3 h-3"/>}
                        iconPosition="right"
                    />
                </div>
            </div>
        </div>
    );
};

export default GenerationForm;