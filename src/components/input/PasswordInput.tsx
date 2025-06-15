import React from "react";
import InputField from "@/components/input/InputField";

interface Props {
    label?: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

const PasswordInput: React.FC<Props> = (props) => (
    <InputField {...props} type="password"/>
);

export default PasswordInput;
