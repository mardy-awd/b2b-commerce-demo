import LinkWidgetModule, { Link } from "@insite/content-library/Widgets/Basic/Link";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import MobiusLink from "@insite/mobius/Link";
import "jest-styled-components";
import { css } from "styled-components";

describe("Link Widget", () => {
    const widgetProps = getWidgetProps({
        fields: { ...composeDefaultFields(), destination: { type: "Url", value: "/" } },
    });
    const styles = {
        link: {
            css: css`
                background: magenta;
            `,
        },
    };
    const app = mountApp(Link, widgetProps, styles);

    test("Is rendering", () => {
        const link = app.find(Link);
        elementIsRendering(link);
    });

    test("StylesProvider styles are being passed", () => {
        const mobiusLink = app.find(MobiusLink);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(mobiusLink, styleRule);
    });
});

function composeDefaultFields() {
    return LinkWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
