import ButtonWidgetModule, { CmsButton, ContentWrapper } from "@insite/content-library/Widgets/Basic/Button";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Button Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        button: {
            wrapperStyles: {
                css: css`
                    background: green;
                `,
            },
        },
    };
    const app = mountApp(CmsButton, widgetProps, styles);

    test("Is rendering", () => {
        const cmsButton = app.find(CmsButton);

        elementIsRendering(cmsButton);
    });

    test("StylesProvider styles are being passed", () => {
        const contentWrapper = app.find(ContentWrapper);
        const styleRule = /\s*background:\s?green;\s*/;

        elementHasStyle(contentWrapper, styleRule);
    });
});

function composeDefaultFields() {
    return ButtonWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
