import RichContentWidgetModule, {
    ContentWrapper,
    RichContent,
} from "@insite/content-library/Widgets/Basic/RichContent";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("RichContent Widget", () => {
    const widgetProps = getWidgetProps({
        fields: { ...composeDefaultFields(), content: "Rich Text" },
    });
    const styles = {
        richContent: {
            wrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };

    const app = mountApp(RichContent, widgetProps, styles);

    test("Is rendering", () => {
        const richContent = app.find(RichContent);

        elementIsRendering(richContent);
    });

    test("StylesProvider styles are being passed", () => {
        const contentWrapper = app.find(ContentWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(contentWrapper, styleRule);
    });
});

function composeDefaultFields() {
    return RichContentWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
