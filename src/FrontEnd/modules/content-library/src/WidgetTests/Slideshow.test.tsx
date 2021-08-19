import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import SlideshowWidgetModule, { Slideshow } from "@insite/content-library/Widgets/Basic/Slideshow";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("SlideShow Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        slideshow: {
            slideshowWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(Slideshow, widgetProps, styles);

    test("Is rendering", () => {
        const slideShow = app.find(Slideshow);

        elementIsRendering(slideShow);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return SlideshowWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field: any) => {
        if (field.name === "slides") {
            acc[field.name] = [
                {
                    fields: field.fieldDefinitions.reduce((innerAcc: any, field: any) => {
                        innerAcc[field.name] = field.defaultValue;
                        return innerAcc;
                    }, {}),
                },
            ];
        } else {
            acc[field.name] = field.defaultValue;
        }
        return acc;
    }, {});
}
