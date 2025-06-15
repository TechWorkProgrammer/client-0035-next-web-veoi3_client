import React from "react";
import {ReactSVG} from "react-svg";

interface IconProps {
    name: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({name, className = ""}) => (
    <ReactSVG
        src={`/assets/icons/${name}.svg`}
        beforeInjection={(svg) => {
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.setAttribute("fill", "currentColor");
            svg.querySelectorAll("[fill]").forEach((el) => el.removeAttribute("fill"));
            svg.setAttribute("class", className);
        }}
        wrapper="span"
    />
);

export default Icon;
