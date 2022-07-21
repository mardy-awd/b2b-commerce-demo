/* eslint-disable spire/export-styles */
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import MobiusLink from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    destination = "destination",
    overrideTitle = "overrideTitle",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.destination]: LinkFieldValue;
        [fields.overrideTitle]: string;
        [fields.customCSS]: string;
    };
}

const linkStyles: InjectableCss = {};

export const Link: FC<OwnProps> = ({ fields }) => {
    const { title, url } = useGetLink(fields.destination);

    const styles = useMergeStyles("link", linkStyles);

    if (!url) {
        return null;
    }

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <MobiusLink className="link" {...styles} href={url}>
                {fields.overrideTitle || title || url}
            </MobiusLink>
        </StyledWrapper>
    );
};

const defaultCustomCss = `.link {
}
`;

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: Link,
    definition: {
        group: "Basic",
        icon: "link",
        fieldDefinitions: [
            {
                name: fields.destination,
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
                fieldType: "General",
                isRequired: true,
                tab: basicTab,
            },
            {
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
                tab: advancedTab,
                defaultValue: defaultCustomCss,
                isVisible: (item, shouldDisplayAdvancedFeatures) => !!shouldDisplayAdvancedFeatures,
                validate: value => {
                    if (value === undefined || value === null) {
                        return "";
                    }

                    const result = cssLinter.parse(value, { silent: true });
                    if (result?.stylesheet?.parsingErrors) {
                        // the error output at this time only has room for one line so we just show the first error
                        return result.stylesheet.parsingErrors.length <= 0
                            ? ""
                            : result.stylesheet.parsingErrors.map(error => `${error.reason} on line ${error.line}`)[0];
                    }

                    return "Unable to parse Css";
                },
                options: {
                    mode: "css",
                    lint: true,
                    autoRefresh: true,
                },
            },
        ],
    },
};

export default widgetModule;
