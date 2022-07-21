import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    getPageLinkByNodeId,
    LinkModel,
    useGetLink,
    useGetLinks,
} from "@insite/client-framework/Store/Links/LinksSelectors";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Link from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    direction = "direction",
    alignment = "alignment",
    title = "title",
    titleLink = "titleLink",
    links = "links",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.direction]: "vertical" | "horizontal";
        [fields.alignment]: "left" | "center" | "right";
        [fields.title]: string;
        [fields.titleLink]: LinkFieldValue;
        [fields.links]: LinkModel[];
        [fields.customCSS]: string;
    };
    extendedStyles?: LinkListStyles;
}

export interface LinkListStyles {
    linkListWrapper?: InjectableCss;
    titleWrapper?: InjectableCss;
    title?: TypographyPresentationProps;
    linkWrapper?: InjectableCss;
}

export const linkListStyles: LinkListStyles = {
    linkListWrapper: {
        css: css`
            text-transform: uppercase;
            padding: 10px 0;
        `,
    },
    titleWrapper: {
        css: css`
            font-weight: bold;
        `,
    },
    linkWrapper: {
        css: css`
            padding: 1px 18px 0 0;
        `,
    },
};

const defaultCustomCss = `.list-wrapper {
}

.title-wrapper {
}

.list-title {
}

.links-wrapper {
}

.list-link {
}
`;

export const LinkList: FC<OwnProps> = ({ fields, extendedStyles }) => {
    const links = useGetLinks(fields.links, o => o.fields.destination);
    const titleLink = useGetLink(fields.titleLink);
    const styles = useMergeStyles("linkList", linkListStyles, extendedStyles);

    const alignmentStyles = {
        css: css`
            text-align: ${fields.alignment || "right"};
            ${styles.linkListWrapper?.css}
        `,
    };

    const directionStyles = {
        css: css`
            ${fields.direction === "horizontal" ? "display: inline-block;" : "padding: 1px 0 0 0;"};
            ${styles.linkWrapper?.css}
        `,
    };

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <StyledWrapper className="list-wrapper" {...alignmentStyles}>
                <StyledWrapper className="title-wrapper" {...styles.titleWrapper}>
                    {titleLink ? (
                        <Link className="list-title" href={titleLink.url}>
                            {fields.title || titleLink.title}
                        </Link>
                    ) : (
                        <Typography className="list-title" as="h3" {...styles.title}>
                            {fields.title}
                        </Typography>
                    )}
                </StyledWrapper>
                {links.map((link, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <StyledWrapper className="links-wrapper" key={index} {...directionStyles}>
                        {link.url && (
                            <Link
                                className="list-link"
                                href={link.url}
                                target={fields.links[index].fields.openInNewWindow ? "_blank" : ""}
                            >
                                {fields.links[index].fields.overriddenTitle || link.title}
                            </Link>
                        )}
                    </StyledWrapper>
                ))}
            </StyledWrapper>
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
    component: LinkList,
    definition: {
        group: "Basic",
        icon: "ax-link-list",
        fieldDefinitions: [
            {
                name: fields.direction,
                editorTemplate: "DropDownField",
                defaultValue: "vertical",
                fieldType: "General",
                options: [
                    {
                        displayName: "Vertical",
                        value: "vertical",
                    },
                    {
                        displayName: "Horizontal",
                        value: "horizontal",
                    },
                ],
                hideEmptyOption: true,
                tab: basicTab,
            },
            {
                name: fields.alignment,
                editorTemplate: "DropDownField",
                defaultValue: "left",
                fieldType: "General",
                options: [
                    {
                        displayName: "Left",
                        value: "left",
                    },
                    {
                        displayName: "Center",
                        value: "center",
                    },
                    {
                        displayName: "Right",
                        value: "right",
                    },
                ],
                hideEmptyOption: true,
                tab: basicTab,
            },
            {
                name: fields.title,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                fieldType: "General",
                name: fields.titleLink,
                displayName: "Title Link",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
                tab: basicTab,
            },
            {
                name: fields.links,
                editorTemplate: "ListField",
                getDisplay: (item: HasFields, state) => {
                    const {
                        destination: { type, value },
                        overriddenTitle,
                    } = item.fields;
                    if (overriddenTitle) {
                        return overriddenTitle;
                    }
                    if (type === "Page") {
                        const link = getPageLinkByNodeId(state, value);
                        return link?.title;
                    }
                    if (type === "Category") {
                        let displayValue = "";
                        const categories = (state as any).pageEditor.categories;
                        if (!categories) {
                            displayValue = "Loading...";
                        } else {
                            const matchingCategories = categories.filter((o: { id: string }) => o.id === value);
                            if (matchingCategories.length === 0) {
                                displayValue = "Unknown";
                            } else {
                                displayValue = matchingCategories[0].shortDescription;
                            }
                        }

                        return displayValue;
                    }
                    if (type === "Url") {
                        return value;
                    }
                    return value;
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: "destination",
                        editorTemplate: "LinkField",
                        defaultValue: {
                            value: "",
                            type: "Page",
                        },
                        isRequired: true,
                    },
                    {
                        name: "overriddenTitle",
                        displayName: "Title",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                    {
                        name: "openInNewWindow",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                    },
                ],
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
