import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

/* stylelint-disable */
const PanelMenuDefaultProps: ComponentThemeProps["panelMenu"]["defaultProps"] = {
    headerColor: "common.backgroundContrast",
    bodyColor: "common.accent",
    childTypographyProps: {
        css: css`
            display: block;
            word-wrap: break-word;
            width: 100%;
        `,
    },
    backIconProps: { src: "ChevronLeft" },
    closeIconProps: { src: "X" },
    panelRowProps: {
        color: "common.accent",
        moreIconProps: {
            src: "ChevronRight",
            size: 22,
        },
    },
};
/* stylelint-enable */

export default PanelMenuDefaultProps;
