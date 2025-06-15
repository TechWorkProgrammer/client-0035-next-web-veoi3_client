import React, {useState} from "react";

interface Props {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<Props> = ({
                                         name,
                                         value,
                                         onChange,
                                         placeholder = "",
                                         type = "text",
                                         required = false,
                                         disabled = false,
                                         onKeyDown,
                                     }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <input
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
        w-full px-4 py-2 bg-primary-700 text-white rounded shadow-md
        transition-all duration-300
        ${isFocused
                ? "border-accent-500 ring-2 ring-accent-500"
                : "border-primary-300 hover:border-accent-400"}
        focus:outline-none focus:ring-2 focus:ring-accent-500
        placeholder-secondary-400
      `}
        />
    );
};

export default InputField;
