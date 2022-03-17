import Clickable from "@insite/mobius/Clickable";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import styled, { StyledComponent } from "styled-components";

interface StyleProps {
    active: boolean;
    clickable: boolean;
}

const ClickerStyle = styled(Clickable)`
    display: inline;
    width: 30px;
    height: 100%;
    padding-top: 7px;
    text-align: center;
    cursor: ${(props: StyleProps) => (props.clickable ? "pointer" : "default")};
    background-color: ${(props: StyleProps & ShellThemeProps) =>
        props.active ? props.theme.colors.custom.activeBackground : props.theme.colors.primary.contrast};
    &:disabled {
        cursor: not-allowed;
    }
    &:focus {
        outline-style: none;
    }
    &:hover:not([disabled]) {
        background-color: ${(props: StyleProps & ShellThemeProps) => props.theme.colors.custom.activeBackground};
        outline-style: none;
    }
` as StyledComponent<typeof Clickable, {}, any, never>;
/**
 * The above should be `StyledComponent<typeof Clickable, {}, ClickableProps & StyleProps, never>`
 * but is unfortunately too deep for typescript;
 */

export default ClickerStyle;
