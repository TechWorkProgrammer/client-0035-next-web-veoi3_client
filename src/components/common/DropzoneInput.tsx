import React, {useState, useRef, useCallback} from 'react';
import {FiFile, FiX, FiUpload} from 'react-icons/fi';
import {useAlert} from "@/context/Alert";

interface DropzoneInputProps {
    onFileChange: (file: File | null) => void;
    accept?: string;
    label?: string;
    maxSize?: number;
}

const DropzoneInput: React.FC<DropzoneInputProps> = ({onFileChange, accept, label, maxSize}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const alert = useAlert();

    const handleFileSelected = useCallback((file: File) => {
        if (maxSize && file.size > maxSize) {
            const limitInMB = Math.ceil(maxSize / 1024 / 1024);
            alert(
                "File Too Large",
                `File size cannot exceed ${limitInMB} MB. Please choose a smaller file.`,
                "error"
            );
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            return;
        }

        setSelectedFile(file);
        onFileChange(file);
    }, [onFileChange, maxSize, alert]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const onFileChangeFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-secondary-400 mb-1">
                {label}
            </label>
            {selectedFile ? (
                <div className="flex items-center justify-between bg-background-light p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FiFile className="text-white w-5 h-5"/>
                        <span className="text-sm text-white truncate">{selectedFile.name}</span>
                    </div>
                    <button type="button" onClick={removeFile} className="p-1 text-secondary-400 hover:text-white">
                        <FiX/>
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragEnter}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragging ? 'border-accent-400 bg-primary-700' : 'border-secondary-500 hover:border-secondary-400'}`
                    }
                >
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={onFileChangeFromInput}
                        accept={accept || "image/png, image/jpeg, image/webp"}
                        className="hidden"
                    />
                    <FiUpload className="mx-auto w-10 h-10 text-secondary-200 mb-2"/>
                    <p className="text-sm text-secondary-200">
                        Click or drop image here
                    </p>
                </div>
            )}
        </div>
    );
};

export default DropzoneInput;