import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Icon from "@insite/mobius/Icon";
import Search from "@insite/mobius/Icons/Search";
import XIcon from "@insite/mobius/Icons/X";
import { TextFieldProps } from "@insite/mobius/TextField/TextField";
import { getProp, resolveColor } from "@insite/mobius/utilities";
import Color from "color";
import React, { ChangeEvent, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import styled, { css, ThemeProps } from "styled-components";

const duration = 200;

const defaultIconStyles = {
    transition: "all 300ms ease",
    zIndex: 10,
};

const inputTransitionStyles: Record<string, object> = {
    entering: { opacity: 1, width: "250px" },
    entered: { opacity: 1, width: "250px" },
    exiting: { opacity: 1, width: "10px" },
    exited: { opactiy: 0, width: "0px" },
};

const iconTransitionStyles: Record<string, object> = {
    entering: { opacity: 1, transform: "scale(1) translateY(0px)" },
    entered: { opacity: 1, transform: "scale(1) translateY(0px)" },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

const AnimatedContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: ${({ theme = baseTheme }) => resolveColor(theme.header.backgroundColor, theme)};
    box-sizing: content-box;
    padding-left: 10px;
    svg {
        cursor: pointer;
    }
`;

const IconContainer = styled.button<any>`
    position: absolute;
    top: -1px;
    right: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(30px) scale(0.7);
    opacity: 0;
    background: transparent;
    border: none;
    svg {
        transition: all ${getProp("theme.transition.duration.regular")}ms ease-in-out;
        color: ${({ theme = baseTheme }) => resolveColor(theme.header.linkColor, theme)};
        &:hover {
            ${getProp("hoverStyle")}
            color: ${({
                theme,
                hoverMode = "darken",
            }: { _color: string; hoverMode: "darken" | "lighten" } & ThemeProps<BaseTheme>) => {
                const { linkColor } = theme.header;
                if (!hoverMode && !linkColor) {
                    return null;
                }
                const hoverColor = resolveColor(linkColor, theme);
                if (hoverMode) {
                    return Color(hoverColor)[hoverMode](0.3).toString();
                }
                return hoverColor;
            }};
            ${getProp("hoverStyle")}
        }
    }
`;

const InputContainer = styled.div`
    position: relative;
    height: 100%;
    transition: opacity 20ms, width 250ms;
    opacity: 0;
    width: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    padding: 5px;
    border-radius: 3px;
    overflow: hidden;
`;

const InputStyle = styled.input`
    &&& {
        height: 30px;
    }
`;

export default function AnimatedTextField(props: TextFieldProps) {
    const [isInputTransition, setIsInputTransition] = useState(false);
    const [isIconTransition, setIsIconTransition] = useState(true);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const openIconClickHandler = () => {
        setIsInputTransition(true);
        setIsIconTransition(false);
        inputRef?.current?.focus();
    };

    const closeIconClickHandler = () => {
        if (inputRef?.current?.value && props.onChange) {
            props.onChange({
                target: {
                    value: "",
                },
            } as ChangeEvent<HTMLInputElement>);
        } else {
            setIsInputTransition(false);
            window.setTimeout(() => {
                setIsIconTransition(true);
            }, 300);
        }
    };

    return (
        <AnimatedContainer>
            <Transition in={isIconTransition} timeout={duration}>
                {(state: string) => (
                    <IconContainer style={{ ...defaultIconStyles, ...iconTransitionStyles[state] }}>
                        <Icon onClick={openIconClickHandler} src={Search} size={24} />
                    </IconContainer>
                )}
            </Transition>
            <Transition in={isInputTransition} timeout={duration}>
                {(state: string) => (
                    <InputContainer
                        style={{
                            ...inputTransitionStyles[state],
                        }}
                    >
                        <InputStyle ref={inputRef} {...props} />
                        <Icon
                            style={{ opacity: isInputTransition ? 1 : 0, zIndex: isInputTransition ? 100 : 0 }}
                            src={XIcon}
                            size={24}
                            css={css`
                                cursor: pointer;
                                svg {
                                    pointer-events: none;
                                }
                            `}
                            data-popover-close={true}
                            onClick={closeIconClickHandler}
                        />
                    </InputContainer>
                )}
            </Transition>
        </AnimatedContainer>
    );
}
