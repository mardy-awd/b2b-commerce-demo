/* eslint-disable spire/export-styles */
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { useShellContext } from "@insite/client-framework/Components/IsInShell";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Button from "@insite/mobius/Button";
import { useHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as cssLinter from "css";
import * as React from "react";
import { FC } from "react";
import styled, { css } from "styled-components";

const enum fields {
    variant = "variant",
    label = "label",
    link = "link",
    alignment = "alignment",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.variant]: "primary" | "secondary" | "tertiary";
        [fields.label]: string;
        [fields.link]: LinkFieldValue;
        [fields.alignment]: string;
        [fields.customCSS]: string;
    };
}

export interface ButtonStyles {
    wrapperStyles: InjectableCss;
}

const wrapperStyles: InjectableCss = {};

export const CmsButton: FC<OwnProps> = ({ fields }) => {
    const history = useHistory();
    const link = useGetLink(fields.link);
    const { isInShell } = useShellContext();

    const onClick = () => {
        if (!link.url) {
            return;
        }

        if (link.url.startsWith("http")) {
            if (isInShell) {
                return;
            }

            window.location.href = link.url;
        } else {
            history.push(link.url);
        }
    };

    const styles = useMergeStyles("button", { wrapperStyles });

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <ContentWrapper alignment={fields.alignment} {...styles?.wrapperStyles} className="wrapper">
                <Button variant={fields.variant} onClick={onClick} className="button">
                    {fields.label}
                </Button>
            </ContentWrapper>
        </StyledWrapper>
    );
};

const defaultCustomCss = `.wrapper {
}

.button {
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

export const ContentWrapper = styled.div<InjectableCss & { alignment: string }>`
    display: flex;
    width: 100%;
    justify-content: ${props => props.alignment ?? "flex-start"};
    ${injectCss};
`;

const widgetModule: WidgetModule = {
    component: CmsButton,
    definition: {
        group: "Basic",
        icon: "rectangle-wide",
        fieldDefinitions: [
            {
                name: fields.variant,
                displayName: "Button Variant",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Primary", value: "primary" },
                    { displayName: "Secondary", value: "secondary" },
                    { displayName: "Tertiary", value: "tertiary" },
                ],
                defaultValue: "primary",
                fieldType: "General",
                tab: basicTab,
            },
            {
                name: fields.label,
                displayName: "Button Label",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.link,
                displayName: "Button Link",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                fieldType: "General",
                tab: basicTab,
            },
            {
                name: fields.alignment,
                displayName: "Button Alignment",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Left", value: "flex-start" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "flex-end" },
                ],
                defaultValue: "primary",
                fieldType: "General",
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
