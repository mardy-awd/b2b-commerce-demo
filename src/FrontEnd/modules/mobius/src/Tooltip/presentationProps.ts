import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const TooltipPresentationPropsDefault: ComponentThemeProps["tooltip"]["defaultProps"] = {
    typographyProps: { size: 13, lineHeight: "18px", css: css` display: block; ` },
    iconProps: {
        size: 18,
        color: "text.accent",
        css: css`
            position: relative;
            top: 0.125em;
        `,
        src: "HelpCircle",
    },
};

export default TooltipPresentationPropsDefault;
