import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LanguageMenuWidgetModule, { LanguageMenu } from "@insite/content-library/Widgets/Common/LanguageMenu";
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
        languages: [
            { id: 1, languageCode: 123 },
            { id: 2, languageCode: 345 },
        ],
    });
    const styles = {
        languageMenu: {
            languageWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(LanguageMenu, widgetProps, styles);

    test("Is rendering", () => {
        const languageMenu = app.find(LanguageMenu);

        elementIsRendering(languageMenu);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return LanguageMenuWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
