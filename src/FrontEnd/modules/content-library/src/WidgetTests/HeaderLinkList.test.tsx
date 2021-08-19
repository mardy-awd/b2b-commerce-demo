import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import HeaderLinkListWidgetModule, { HeaderLinkList } from "@insite/content-library/Widgets/Header/HeaderLinkList";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("HeaderLinkList Widget", () => {
    const widgetProps = getWidgetProps({
        fields: {
            ...composeDefaultFields(),
            links: [
                {
                    fields: {
                        destination: {
                            type: "Url",
                            value: "/",
                        },
                    },
                },
            ],
        },
    });
    const styles = {
        headerLinkList: {
            headerLinkListWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(HeaderLinkList, widgetProps, styles);

    test("Is rendering", () => {
        const headerLinkList = app.find(HeaderLinkList);

        elementIsRendering(headerLinkList);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers, styleRule);
    });
});

function composeDefaultFields() {
    return HeaderLinkListWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
