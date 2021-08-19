import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LinkListWidgetModule, { LinkList } from "@insite/content-library/Widgets/Basic/LinkList";
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
        linkList: {
            linkListWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };

    const app = mountApp(LinkList, widgetProps, styles);

    test("Is rendering", () => {
        const linkList = app.find(LinkList);

        elementIsRendering(linkList);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return LinkListWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
