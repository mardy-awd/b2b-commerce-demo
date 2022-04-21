import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _cartLink from "@insite/content-library/Widgets/Common/CartLink";
import React from "react";

function Cart(props: any) {
    return createWidgetElement("Common/CartLink", { ...props, isCompactHeaderCart: true });
}

const widgetModule: WidgetModule = {
    component: Cart,
    definition: {
        group: "Compact Header",
        icon: "cart-shopping",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: _cartLink.definition.fieldDefinitions,
    },
};

// eslint-disable-next-line spire/export-styles
export default widgetModule;
