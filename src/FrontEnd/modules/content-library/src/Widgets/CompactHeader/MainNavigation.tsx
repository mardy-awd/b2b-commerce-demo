import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _mainNavigationModule from "@insite/content-library/Widgets/Header/MainNavigation";
import React from "react";

function MainNavigation(props: any) {
    return createWidgetElement("Header/MainNavigation", {
        ...props,
        isCompactHeaderMainNavigation: true,
    });
}

const widgetModule: WidgetModule = {
    component: MainNavigation,
    definition: {
        group: "Compact Header",
        icon: "magnifying-glass",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: _mainNavigationModule.definition.fieldDefinitions,
    },
};

// eslint-disable-next-line spire/export-styles
export default widgetModule;
