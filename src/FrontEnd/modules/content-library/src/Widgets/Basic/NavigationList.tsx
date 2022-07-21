import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
/* eslint-disable spire/export-styles */
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link from "@insite/mobius/Link";
import * as cssLinter from "css";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const enum fields {
    depth = "depth",
    nodeId = "nodeId",
    leftMargin = "leftMargin",
    marginBottom = "marginBottom",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.depth]: number;
        [fields.nodeId]: LinkFieldValue;
        [fields.leftMargin]: number;
        [fields.marginBottom]: number;
        [fields.customCSS]: string;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    rootPageLink: getPageLinkByNodeId(state, ownProps.fields.nodeId?.value || getCurrentPage(state).nodeId),
    displayChangeCustomerLink: state.context.session?.displayChangeCustomerLink || false,
});

interface ListStyleProp {
    leftMargin: number;
    marginBottom: number;
}

const ListStyle = styled.ul<ListStyleProp>`
    margin-left: ${props => props.leftMargin}px;
    li {
        margin-bottom: ${props => props.marginBottom}px;
    }
`;

const mapDispatchToProps = {};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export const NavigationList = (props: Props) => {
    if (!props.rootPageLink || !props.rootPageLink.children) {
        return null;
    }

    const customCssWrapper = {
        css: css`
            ${props.fields.customCSS}
        `,
    };

    const renderLink = (pageLink: PageLinkModel, currentDepth: number) => {
        if (currentDepth > props.fields.depth) {
            return;
        }

        if (
            pageLink.excludeFromNavigation ||
            (pageLink.type === "ChangeCustomerPage" && !props.displayChangeCustomerLink)
        ) {
            return;
        }

        const nextDepth = currentDepth + 1;

        return (
            <li key={pageLink.id} className="navigation-list-item">
                <Link
                    className="navigation-list-link"
                    data-test-selector={`navigationList-${pageLink.title}`}
                    href={pageLink.url}
                >
                    {pageLink.title}
                </Link>
                {pageLink.children && pageLink.children.length > 0 && (
                    <ListStyle
                        marginBottom={props.fields.marginBottom}
                        leftMargin={props.fields.leftMargin}
                        key={pageLink.id}
                    >
                        {pageLink.children.map(link => renderLink(link, nextDepth))}
                    </ListStyle>
                )}
            </li>
        );
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <ListStyle
                className="navigation-list"
                marginBottom={props.fields.marginBottom}
                leftMargin={props.fields.leftMargin}
                data-test-selector="navigationList"
            >
                {props.rootPageLink.children.map(link => renderLink(link, 1))}
            </ListStyle>
        </StyledWrapper>
    );
};

const defaultCustomCss = `.navigation-list{
}

.navigation-list-item {
}

.navigation-list-link {
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
    component: connect(mapStateToProps, mapDispatchToProps)(NavigationList),
    definition: {
        group: "Basic",
        icon: "link-simple",
        fieldDefinitions: [
            {
                name: fields.depth,
                displayName: "Depth",
                editorTemplate: "IntegerField",
                defaultValue: 2,
                fieldType: "General",
                tab: basicTab,
            },
            {
                name: fields.nodeId,
                displayName: "Page",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                fieldType: "General",
                allowUrls: item => false,
                allowCategories: item => false,
                tab: basicTab,
            },
            {
                name: fields.leftMargin,
                displayName: "Left Margin",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                max: 100,
                min: 0,
                tab: basicTab,
            },
            {
                name: fields.marginBottom,
                displayName: "Margin Bottom",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                max: 100,
                min: 0,
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
