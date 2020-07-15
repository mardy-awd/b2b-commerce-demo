import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import Link from "@insite/mobius/Link";

const enum fields {
    pageType = "pageType",
    overrideTitle = "overrideTitle",
    queryString = "queryString",
    testSelector = "testSelector",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.pageType]: string;
        [fields.overrideTitle]: string;
        [fields.queryString]: string;
        [fields.testSelector]: string;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    pageLink: getPageLinkByPageType(state, ownProps.fields.pageType),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const PageTypeLink: React.FC<Props> = ({ pageLink, fields: { queryString, testSelector, overrideTitle } }) => {
    if (!pageLink) {
        return  null;
    }

    const url = queryString ? `${pageLink.url}?${queryString}` : pageLink.url;

    const selector = testSelector;
    return <Link href={url} data-test-selector={selector}>{overrideTitle || pageLink.title}</Link>;
};

const pageTypeLink: WidgetModule = {
    component: connect(mapStateToProps)(PageTypeLink),
    definition: {
        group: "Basic",
        icon: "Link",
        isSystem: true,
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.pageType,
                editorTemplate: "TextField",
                defaultValue: "",
                isRequired: true,
            },
            {
                fieldType: "Translatable",
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",

            },
            {
                fieldType: "Translatable",
                name: fields.queryString,
                editorTemplate: "TextField",
                defaultValue: "",

            },
        ],
    },
};

export default pageTypeLink;