import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ImageWidgetModule, { Image } from "@insite/content-library/Widgets/Basic/Image";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Image Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        image: {
            wrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };

    const app = mountApp(Image, widgetProps, styles);

    test("Is rendering", () => {
        const image = app.find(Image);
        elementIsRendering(image);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrapper = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;
        elementHasStyle(styledWrapper, styleRule);
    });
});

function composeDefaultFields() {
    return ImageWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
