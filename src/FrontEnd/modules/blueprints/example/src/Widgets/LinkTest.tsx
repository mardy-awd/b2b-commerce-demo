import { getPageLinkByNodeId, LinkModel } from "@insite/client-framework/Store/Links/LinksSelectors";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    links = "links",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.links]: LinkModel[];
    };
}

export const LinkTest: FC<OwnProps> = () => {
    return <div>This is a LinkTest widget</div>;
};

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const widgetModule: WidgetModule = {
    component: LinkTest,
    definition: {
        group: "Testing",
        icon: "ax-link-list",
        fieldDefinitions: [
            {
                name: fields.links,
                editorTemplate: "ListField",
                getDisplay: (item: HasFields) => {
                    return item.fields.overriddenTitle;
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: fields.links,
                        editorTemplate: "ListField",
                        getDisplay: (item: HasFields) => {
                            return item.fields.overriddenTitle;
                        },
                        defaultValue: [],
                        fieldDefinitions: [
                            {
                                name: "overriddenTitle",
                                displayName: "Title",
                                editorTemplate: "TextField",
                                defaultValue: "",
                            },
                        ],
                        tab: basicTab,
                    },
                    {
                        name: "overriddenTitle",
                        displayName: "Title",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                ],
                tab: basicTab,
            },
        ],
    },
};

export default widgetModule;
