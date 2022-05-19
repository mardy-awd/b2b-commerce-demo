import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { Styles, StylesProvider } from "@insite/content-library/additionalStyles";
import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Page, { PageProps as MobiusPageProps } from "@insite/mobius/Page";
import { breakpointMediaQueries, injectCss, resolveColor } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import styled, { css, ThemeProps, withTheme } from "styled-components";

type Props = PageProps & HasShellContext & ThemeProps<BaseTheme>;
export interface CompactHeaderStyles {
    page?: MobiusPageProps;
    mainNavigationWrapper?: InjectableCss;
    logoWrapper?: InjectableCss;
    searchWrapper?: InjectableCss;
    pageInnerWrapper?: InjectableCss;
}

const boxShadowStyleMap: Dictionary<string> = {
    light: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    medium: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    dark: "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
};

function generateShadow(props: ThemeProps<BaseTheme>) {
    const { isDropShadow, dropShadowStyle } = props.theme.header;
    if (isDropShadow && dropShadowStyle in boxShadowStyleMap) {
        return `box-shadow: ${boxShadowStyleMap[dropShadowStyle]}`;
    }
    return "";
}

function generateBorder(props: ThemeProps<BaseTheme>) {
    const { isBorder, borderColor, borderThickness, isBorderTop, isBorderLeft, isBorderBottom, isBorderRight } =
        props.theme.header;
    if (!isBorder) {
        return "border: none;";
    }

    let border = `border: ${borderThickness}px solid ${resolveColor(borderColor, props.theme)};`;

    if (!isBorderTop) {
        border += "border-top: none;";
    }
    if (!isBorderBottom) {
        border += "border-bottom: none;";
    }
    if (!isBorderLeft) {
        border += "border-left: none;";
    }
    if (!isBorderRight) {
        border += "border-right: none;";
    }

    return border;
}

export const compactHeaderStyles: CompactHeaderStyles = {
    page: {
        padding: 0, // * Padding doesn't work with fullWidth because of logic on Line 64 if Page component
        fullWidth: [true, true, true, true, true], // make the header full width and control the margins with container css
        css: css`
            position: fixed;
            top: 0;
            left: 50%;
            z-index: 1;
            opacity: 0;
            transform: translateY(-100%) translateX(-50%);
            padding: ${props => props.theme.header.padding};
            ${generateBorder}
            ${generateShadow};
        `,
    },
    logoWrapper: {
        css: css`
            align-self: center;
        `,
    },
    searchWrapper: {
        css: css`
            align-self: center;
        `,
    },
    mainNavigationWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
};

const styles = compactHeaderStyles;

export const createStylesProviderStyles = (theme: BaseTheme) =>
    ({
        mainNavigation: {
            menuItemTypography: {
                css: css`
                    font-weight: 600;
                    white-space: nowrap;
                `,
                color: theme.header.linkColor,
            },
        },
        logo: {
            img: {
                css: css`
                    width: 50px !important;
                    height: auto !important;
                `,
            },
        },
        headerSearchInput: {
            searchInputStyles: {
                popoverContentBody: {
                    as: "div",
                    _height: "auto",
                    css: css`
                        display: inline-flex;
                        justify-content: flex-end;
                        border-radius: 3px;
                    `,
                },
                searchHistoryStyles: {
                    wrapper: {
                        css: css`
                            display: flex;
                            flex-direction: column;
                            width: 240px;
                            padding: 0 20px 15px 20px;
                        `,
                    },
                },
            },
        },
    } as Styles);

const transitionStyles: Dictionary<{ opacity: number; transform: string }> = {
    entering: { opacity: 1, transform: "translateY(0px) translateX(-50%)" },
    entered: { opacity: 1, transform: "translateY(0px) translateX(-50%)" },
    exiting: { opacity: 1, transform: "translateY(0px) translateX(-50%)" },
    exited: { opacity: 0, transform: "translateY(-100%) translateX(-50%)" },
};

const InnerWrapper = styled.div<{ isEdit?: boolean } & InjectableCss>`
    display: grid;
    grid-template-columns: ${props => (props.isEdit ? "200px 200px auto 200px 200px" : "66px 50px auto 36px 60px")};
    padding: ${props => props.isEdit && "30px 10px"};
    width: 100%;
    margin: 0 auto;
    ${({ theme, isEdit }) => {
        const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
        return isEdit
            ? css`
                  max-width: 100%;
              `
            : breakpointMediaQueries(
                  theme,
                  maxWidths.map((mw: any) =>
                      mw
                          ? css`
                                max-width: ${mw}px;
                            `
                          : null,
                  ),
              );
    }}
    ${injectCss}
`;

const CompactHeader = (props: Props) => {
    const { isCurrentPage, isEditing, isInShell } = props.shellContext;
    const isShell = isCurrentPage && isInShell;
    const isEdit = isCurrentPage && isEditing && isInShell;
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        function eventHandler() {
            const scrollPos = Math.round(window.scrollY);
            const windowWidth = Math.round(window.innerWidth);

            if (scrollPos > props.theme.header.triggerPoint && windowWidth > 767) {
                setIsShow(true);
            } else if ((isShow && scrollPos < props.theme.header.triggerPoint) || windowWidth < 768) {
                setIsShow(false);
            }
        }
        window.addEventListener("scroll", eventHandler, { passive: true });

        return () => {
            window.removeEventListener("scroll", eventHandler);
        };
    }, [props.theme.header.triggerPoint, isShow]);

    useEffect(() => {
        setIsShow(Boolean(isShell));
    }, [isShell]);

    return (
        <Transition in={isShow} timeout={0}>
            {state => (
                <Page
                    {...styles.page}
                    as="header"
                    background={props?.theme?.header?.backgroundColor}
                    style={{
                        transition: "all 350ms ease",
                        pointerEvents: isShow ? "auto" : "none",
                        ...transitionStyles[state],
                    }}
                >
                    <StylesProvider styles={createStylesProviderStyles(props.theme)}>
                        <InnerWrapper isEdit={isEdit} {...styles.pageInnerWrapper}>
                            <Zone fullHeight contentId={props.id} zoneName="Flyout" />
                            <StyledWrapper {...styles.logoWrapper}>
                                <Zone fullHeight contentId={props.id} zoneName="Logo" />
                            </StyledWrapper>
                            <StyledWrapper {...styles.mainNavigationWrapper}>
                                <Zone fullHeight contentId={props.id} zoneName="MainNavigation" normalWidth />
                            </StyledWrapper>
                            <StyledWrapper {...styles.searchWrapper}>
                                <Zone fullHeight contentId={props.id} zoneName="Search" />
                            </StyledWrapper>
                            <Zone fullHeight contentId={props.id} zoneName="Cart" />
                        </InnerWrapper>
                    </StylesProvider>
                </Page>
            )}
        </Transition>
    );
};

const pageModule: PageModule = {
    component: withTheme(withIsInShell(CompactHeader)),
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;
