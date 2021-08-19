import QuickOrderWidgetModule, { QuickOrder } from "@insite/content-library/Widgets/Basic/QuickOrder";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import GridContainer from "@insite/mobius/GridContainer";
import "jest-styled-components";
import { css } from "styled-components";

describe("QuickOrder Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
        allowQuickOrder: true,
    });
    const styles = {
        quickOrder: {
            container: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(QuickOrder, widgetProps, styles);

    test("Is rendering", () => {
        const quickOrder = app.find(QuickOrder);

        elementIsRendering(quickOrder);
    });

    test("StylesProvider styles are being passed", () => {
        const gridContainer = app.find(GridContainer).at(0);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(gridContainer, styleRule);
    });
});

function composeDefaultFields() {
    return QuickOrderWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
