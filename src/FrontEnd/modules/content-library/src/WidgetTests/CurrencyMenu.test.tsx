import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import CurrencyMenuWidgetModule, { CurrencyMenu } from "@insite/content-library/Widgets/Common/CurrencyMenu";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("HeaderSignIn Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
        currencies: [
            { id: 1, currencyCode: 123 },
            { id: 2, currencyCode: 345 },
        ],
    });
    const styles = {
        currencyMenu: {
            currencyWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(CurrencyMenu, widgetProps, styles);

    test("Is rendering", () => {
        const currencyMenu = app.find(CurrencyMenu);

        elementIsRendering(currencyMenu);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return CurrencyMenuWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
