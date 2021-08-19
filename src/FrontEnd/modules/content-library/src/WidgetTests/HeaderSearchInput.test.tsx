import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import HeaderSearchInputWidgetModule, {
    HeaderSearchInput,
} from "@insite/content-library/Widgets/Header/HeaderSearchInput";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import TextField from "@insite/mobius/TextField";
import "jest-styled-components";
import { css } from "styled-components";

function composeDefaultFields() {
    return HeaderSearchInputWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}

describe("HeaderSearchInput Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        headerSearchInput: {
            searchInputStyles: {
                input: {
                    css: css`
                        background: magenta;
                    `,
                },
            },
        },
    };
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
    const app = mountApp(HeaderSearchInput, widgetProps, styles, initialState);

    test("Is rendering", () => {
        const headerSearchInput = app.find(HeaderSearchInput);

        elementIsRendering(headerSearchInput);
    });

    test("StylesProvider styles are being passed", () => {
        const textField = app.find(TextField);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(textField, styleRule);
    });
});
