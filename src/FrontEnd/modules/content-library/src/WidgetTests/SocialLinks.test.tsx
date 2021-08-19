import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import SocialLinksWidgetModule, { SocialLinks } from "@insite/content-library/Widgets/Basic/SocialLinks";
import {
    elementHasStyle,
    elementIsRendering,
    getWidgetProps,
    mountApp,
} from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("SocialLinks Widget", () => {
    const widgetProps = getWidgetProps({
        fields: composeDefaultFields(),
    });
    const styles = {
        socialLinks: {
            socialLinkListWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        },
    };
    const app = mountApp(SocialLinks, widgetProps, styles);

    test("Is rendering", () => {
        const socialLinks = app.find(SocialLinks);

        elementIsRendering(socialLinks);
    });

    test("StylesProvider styles are being passed", () => {
        const styledWrappers = app.find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});

function composeDefaultFields() {
    return SocialLinksWidgetModule?.definition?.fieldDefinitions?.reduce((acc: any, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}
