/* eslint-disable spire/export-styles */
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { extractStylesToArray, isSafe } from "@insite/client-framework/Common/Utilities/isSafeStyles";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as cssLinter from "css";
import parse from "html-react-parser";
import * as React from "react";
import styled, { css } from "styled-components";

const enum fields {
    backgroundColor = "backgroundColor",
    padding = "padding",
    content = "content",
    customCSS = "customCSS",
}

interface Props extends WidgetProps {
    fields: {
        [fields.backgroundColor]: string;
        [fields.padding]: number;
        [fields.content]: string;
        [fields.customCSS]: string;
    };
}

export interface RichContentStyles {
    wrapper?: InjectableCss;
}

const richContentStyles = {
    wrapper: {},
};

const defaultCustomCss = `.wrapper{
}`;

export const RichContent: React.FunctionComponent<Props> = props => {
    if (!props.fields.content) {
        return null;
    }

    const styles = useMergeStyles("richContent", richContentStyles);

    const customCssWrapper = {
        css: css`
            ${props.fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <ContentWrapper
                className="wrapper"
                {...styles.wrapper}
                backgroundColor={props.fields.backgroundColor}
                padding={props.fields.padding}
            >
                {parse(props.fields.content, parserOptions)}
            </ContentWrapper>
        </StyledWrapper>
    );
};

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: RichContent,
    definition: {
        group: "Basic",
        icon: "text",
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.backgroundColor,
                editorTemplate: "ColorPickerField",
                displayName: "Background Color",
                defaultValue: "",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.padding,
                editorTemplate: "IntegerField",
                displayName: "Content Padding",
                defaultValue: 0,
                tab: basicTab,
            },
            {
                name: fields.content,
                displayName: "Content",
                editorTemplate: "RichTextField",
                defaultValue: "",
                fieldType: "Contextual",
                validate: (html: string) => {
                    const arrayOfStyles = extractStylesToArray(html);
                    return arrayOfStyles?.every(style => isSafe(style))
                        ? null
                        : "The HTML contains invalid styles that prevent it from being saved";
                },
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

export const ContentWrapper = styled.div<{ backgroundColor: string; padding: number } & InjectableCss>`
    ${({ backgroundColor }) => (backgroundColor ? `background-color: ${backgroundColor};` : null)};
    ${({ padding }) => (padding ? `padding: ${padding}px;` : null)};
    & > *:last-child {
        margin: 0;
    }
    ${injectCss}
`;
