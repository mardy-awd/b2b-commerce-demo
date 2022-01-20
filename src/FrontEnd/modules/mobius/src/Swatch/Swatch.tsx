import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Slash from "@insite/mobius/Icons/Slash";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as React from "react";
import styled from "styled-components";

export enum SwatchTypeValues {
    Image = "Image",
    Color = "Color",
}

export interface SwatchPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    colorCss?: StyledProp<SwatchProps>;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    captionCss?: StyledProp<SwatchProps>;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    imageCss?: StyledProp<SwatchProps>;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    borderCss?: StyledProp<SwatchProps>;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    disabledCss?: StyledProp<SwatchProps>;
    /** Props to be passed down to the Typography component.
     * @themable */
    captionProps?: TypographyProps;
    /** Defaults to 19, used to calculate the border width and height as well as other dimensions */
    size?: number;
}

export type SwatchProps = {
    /** When type is Image an img tag will be rendered with the src being the value prop.
     * When the type is color the value will be used as the background-color
     * When no type is given or value is given the component defaults to a gray color.
     */
    type: SwatchTypeValues;
    /** Url image path, hexcode or other color format */
    value: string;
    /** Description that appears with the swatch.
     * When no caption is provided, the caption is is not rendered
     */
    caption?: string;
    /** Renders Slash SVG over the swatch.
     * When isDisabled is false, the Disabled layer does not render
     */
    isDisabled?: boolean;
    /** Border for the swatch to indicate it is selected.
     * When true, the border is a blue, rather than transparent
     */
    isSelected?: boolean;
    /** Click event called when the border or text is clicked */
    onClick?: (event: React.SyntheticEvent) => void;
} & SwatchPresentationProps;

const DEFAULT_COLOR = "222";
const SIZE = 19;
const SPACE_BETWEEN = 2;
const BORDER_WIDTH = 2;

const getSize = ({ size }: { size?: number }) => size || SIZE;

const getBorderSize = ({ size }: { size?: number }) => (size || SIZE) + SPACE_BETWEEN * 2 + BORDER_WIDTH * 2;

const getBorderRadius = ({ theme }: { theme: BaseTheme }) => {
    const options = theme.swatch.borderRadius as Record<string, string>;
    const type = theme.swatch.borderType;
    return options[type];
};

export const Color = styled.span<{ isDisabled?: boolean; color?: string; size?: number } & InjectableCss<SwatchProps>>`
    position: absolute;
    top: ${SPACE_BETWEEN}px;
    left: ${SPACE_BETWEEN}px;
    display: inline-block;
    width: ${getSize}px;
    height: ${getSize}px;
    border-radius: ${getBorderRadius};
    vertical-align: middle;
    background-color: #${props => props.color};
    opacity: ${props => (props.isDisabled ? ".5" : "1")};
    ${injectCss}
`;

export const Image = styled.img<{ isDisabled?: boolean; size?: number; loading: string } & InjectableCss<SwatchProps>>`
    position: absolute;
    top: ${SPACE_BETWEEN}px;
    left: ${SPACE_BETWEEN}px;
    height: ${getSize}px;
    width: ${getSize}px;
    border-radius: ${getBorderRadius};
    opacity: ${props => (props.isDisabled ? ".5" : "1")};
    ${injectCss}
`;

export const Border = styled.div<{ isSelected?: boolean; size?: number } & InjectableCss<SwatchProps>>`
    position: relative;
    background: transparent;
    display: inline-block;
    min-height: ${getBorderSize}px;
    min-width: ${getBorderSize}px;
    border-radius: ${getBorderRadius};
    border-width: ${BORDER_WIDTH}px;
    border-style: solid;
    border-color: ${props => (props.isSelected ? "#00A3FF" : "transparent")};
    padding: 2px;
    margin: 0 5px;
    ${injectCss}
`;

export const Disabled = styled.span<{ size?: number } & InjectableCss<SwatchProps>>`
    svg {
        position: absolute;
        top: ${SPACE_BETWEEN}px;
        left: ${SPACE_BETWEEN}px;
        height: ${getSize}px;
        width: ${getSize}px;
        opacity: 0.75;
    }
    ${injectCss}
`;

const Swatch = ({
    type,
    caption = "",
    colorCss,
    imageCss,
    borderCss,
    disabledCss,
    value,
    onClick,
    isDisabled,
    isSelected,
    size,
    captionProps,
}: SwatchProps) => {
    return (
        <>
            <Border isSelected={isSelected} onClick={onClick} size={size} css={borderCss}>
                {type === SwatchTypeValues.Image && value ? (
                    <Image
                        width={size}
                        height={size}
                        loading="lazy"
                        src={value}
                        isDisabled={isDisabled}
                        alt={caption}
                        css={imageCss}
                        size={size}
                    />
                ) : (
                    <Color
                        css={colorCss}
                        color={removeHash(value || DEFAULT_COLOR)}
                        isDisabled={isDisabled}
                        size={size}
                    />
                )}

                {isDisabled && (
                    <Disabled size={size} css={disabledCss}>
                        <Slash />
                    </Disabled>
                )}
            </Border>
            {caption && (
                <Typography {...captionProps} onClick={onClick}>
                    {caption}
                </Typography>
            )}
        </>
    );
};

function removeHash(str = "") {
    if (str[0] === "#") {
        return str.slice(1);
    }
    return str;
}

Swatch.displayName = "Swatch";

/** @component */
export default Swatch;
