import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { getPageLinkByNodeId, LinkModel, useGetLinks } from "@insite/client-framework/Store/Links/LinksSelectors";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { css } from "styled-components";

const enum fields {
    links = "links",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.links]: LinkModel[];
        [fields.customCSS]: string;
    };
    extendedStyles?: HeaderLinkListStyles;
}

export interface HeaderLinkListStyles {
    headerLinkListWrapper?: InjectableCss;
    link?: LinkPresentationProps;
}

export const headerLinkListStyles: HeaderLinkListStyles = {
    headerLinkListWrapper: {
        css: css`
            text-align: right;
            padding: 0 0 23px 0;
            margin-right: -9px;
        `,
    },
    link: {
        typographyProps: {
            variant: "headerTertiary",
            css: css`
                margin: 0 9px 0 9px;
                display: inline-block;
                &&& {
                    color: ${getColor("text.main")};
                }
            `,
        },
    },
};

const defaultCustomCss = `.list-wrapper {
}

.list-link {
}
`;

export const HeaderLinkList: React.FC<OwnProps> = ({ fields, extendedStyles }) => {
    const links = useGetLinks(fields.links, o => o.fields.destination);

    const styles = useMergeStyles("headerLinkList", headerLinkListStyles, extendedStyles);

    if (links.length < 1) {
        return null;
    }

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <StyledWrapper className="list-wrapper" {...styles.headerLinkListWrapper}>
                {links.map(
                    (link, index) =>
                        link.url && (
                            <Link
                                className="list-link"
                                key={`${link.url}.${link.title}`}
                                href={link.url}
                                target={fields.links[index].fields.openInNewWindow ? "_blank" : ""}
                                {...styles.link}
                            >
                                {link.title}
                            </Link>
                        ),
                )}
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
    component: HeaderLinkList,
    definition: {
        group: "Header",
        icon: "list-ul",
        fieldDefinitions: [
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
