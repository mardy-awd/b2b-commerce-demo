import { injectCss, resolveColor } from "@insite/mobius/utilities";
import shellTheme from "@insite/shell/ShellTheme";
import React from "react";
import styled, { Interpolation } from "styled-components";

const IconContainer = styled.div<{
    size?: number;
    color?: string;
    rotation?: Props["rotation"];
    css?: Interpolation<any>;
}>`
    display: inline;
    i {
        color: ${props => (props.color ? resolveColor(props.color, props.theme) : shellTheme.colors.text.main)};
        font-size: ${props => props.size || 16}px;
        transition: transform 0.2s ease-in-out;
        transform: ${props => rotate(props.rotation)};
    }
    ${injectCss}
`;

export interface Props {
    rotation?: "left" | "right" | "none" | "flip";
    src: string;
    size?: number;
    color?: string;
    css?: Interpolation<any>;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const AxiomIcon = ({ src, size, color, css, onClick, rotation, ...otherProps }: Props) => (
    <IconContainer color={color} css={css} size={size} rotation={rotation} onClick={onClick} {...otherProps}>
        <i className={`fa-light fa-${src}`}></i>
    </IconContainer>
);

const rotationMap = {
    flip: "rotate(-180deg)",
    none: "rotate(0deg)",
    left: "rotate(90deg)",
    right: "rotate(-90deg)",
};

function rotate(rotation: Props["rotation"]) {
    if (!rotation) {
        return "rotate(0deg)";
    }
    return rotationMap[rotation];
}
export default AxiomIcon;
