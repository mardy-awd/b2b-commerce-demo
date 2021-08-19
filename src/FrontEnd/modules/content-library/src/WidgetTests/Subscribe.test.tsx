import SubscribeWidgetModule, { CmsSubscribe } from "@insite/content-library/Widgets/Basic/Subscribe";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import GridContainer from "@insite/mobius/GridContainer";
import "jest-styled-components";
import { css } from "styled-components";

describe("Subscribe Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        subscribe: {
            mainGridContainer: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(CmsSubscribe, widgetProps, styles);

    test("Is rendering", () => {
        const cmsSubscribe = app.find(CmsSubscribe);

        elementIsRendering(cmsSubscribe);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(GridContainer);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return SubscribeWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
