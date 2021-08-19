import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LogoWidgetModule, { Logo } from "@insite/content-library/Widgets/Basic/Logo";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Logo Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        logo: {
            wrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };

    const app = mountApp(Logo, widgetProps, styles);

    test("Is rendering", () => {
        const logo = app.find(Logo);

        elementIsRendering(logo);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrapper = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrapper, styleRule);
    });
});

function composeDefaultFields() {
    return LogoWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
