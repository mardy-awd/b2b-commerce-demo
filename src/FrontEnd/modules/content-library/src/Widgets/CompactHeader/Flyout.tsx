import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _mainNavigation from "@insite/content-library/Widgets/Header/MainNavigation";

function Flyout(props: any) {
    return createWidgetElement("Header/MainNavigation", {
        ...props,
        isCompactHeaderFlyoutMenu: true,
    });
}

const flyout: WidgetModule = {
    component: Flyout,
    definition: {
        group: "Compact Header",
        icon: "magnifying-glass",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: _mainNavigation.definition.fieldDefinitions,
    },
};

// eslint-disable-next-line spire/export-styles
export default flyout;
