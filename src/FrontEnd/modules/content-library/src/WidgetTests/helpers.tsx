import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { configureStore } from "@insite/client-framework/Store/ConfigureStore";
import { StylesProvider } from "@insite/content-library/additionalStyles";
import baseTheme from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { Provider } from "react-redux";

export function elementHasStyle(component: any, styleRule: any) {
    // For some reason, the toHaveStylesRule method is not working on expect
    // I had to use toMatch so that I could use regex because space characters were
    // throwing off the match

    expect(component.props().css.join("")).toMatch(styleRule);
}

export function elementIsRendering(component: any) {
    expect(component).toHaveLength(1);
}

export function getWidgetProps(additionalProps: {}) {
    return {
        id: "1",
        parentId: "1",
        isLayout: false,
        type: "general",
        zone: "top",
        generalFields: {},
        translatableFields: {},
        contextualFields: {},
        ...additionalProps,
    };
}

export const mountApp = (
    Component: any,
    props: any,
    styles: any = {},
    initialState: ApplicationState | undefined = undefined,
) => {
    const store = configureStore(initialState);

    return mount(
        <Provider store={store}>
            <ThemeProvider translate={str => str} theme={baseTheme}>
                <StylesProvider styles={styles}>
                    <Component {...props} />
                </StylesProvider>
            </ThemeProvider>
        </Provider>,
    );
};
