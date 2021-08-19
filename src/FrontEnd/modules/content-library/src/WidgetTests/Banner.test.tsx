import BannerWidgetModule, { Banner } from "@insite/content-library/Widgets/Basic/Banner";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import Button from "@insite/mobius/Button";
import "jest-styled-components";
import { css } from "styled-components";

describe("Button Widget", () => {
    const widgetProps = getWidgetProps({ fields: composeDefaultFields() });
    const styles = {
        banner: {
            bannerButton: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(Banner, widgetProps, styles);

    test("Is rendering", () => {
        const banner = app.find(Banner);

        elementIsRendering(banner);
    });

    test("StylesProvider styles are being passed", () => {
        const button = app.find(Button);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(button, styleRule);
    });
});

function composeDefaultFields() {
    return BannerWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
