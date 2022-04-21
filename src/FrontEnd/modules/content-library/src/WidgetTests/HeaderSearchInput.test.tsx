import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import HeaderSearchInputWidgetModule, {
    HeaderSearchInput,
} from "@insite/content-library/Widgets/Header/HeaderSearchInput";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import TextField from "@insite/mobius/TextField";
import AnimatedTextField from "@insite/mobius/TextField/AnimatedTextField";
import "jest-styled-components";
import { css } from "styled-components";

describe("HeaderSearchInput Widget", () => {
    const { renderWidget, useStyles, useProps } = setupWidgetRendering(
        HeaderSearchInput,
        HeaderSearchInputWidgetModule,
    );

    const initialState = {
        context: {
            settings: {
                settingsCollection: {
                    searchSettings: {
                        autocompleteEnabled: true,
                        searchHistoryEnabled: true,
                        searchHistoryLimit: 10,
                        enableBoostingByPurchaseHistory: true,
                        allowFilteringForPreviouslyPurchasedProducts: true,
                    },
                },
            },
        },
    } as ApplicationState;

    test("Is rendering", () => {
        const headerSearchInput = renderWidget().find(HeaderSearchInput);

        elementIsRendering(headerSearchInput);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.headerSearchInput = {
            searchInputStyles: {
                input: {
                    css: css`
                        background: magenta;
                    `,
                },
            },
        };

        const textField = renderWidget().find(TextField);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(textField, styleRule);
    });

    test("isAnimated props is passed down and rendering AnimatedTextField", () => {
        const props = useProps();
        props.isAnimated = true;

        const widgets = renderWidget();

        const textField = widgets.find(TextField);
        const animatedTextField = widgets.find(AnimatedTextField);

        expect(textField.props().isAnimated).toBe(true);
        expect(animatedTextField).toHaveLength(1);
    });
});
