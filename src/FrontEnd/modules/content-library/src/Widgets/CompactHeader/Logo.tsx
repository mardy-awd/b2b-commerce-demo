import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _logoModule, { LogoStyles } from "@insite/content-library/Widgets/Basic/Logo";

export const extendedStyles: LogoStyles = {};

function Logo(props: any) {
    return createWidgetElement("Basic/Logo", { extendedStyles, ...props });
}

const widgetModule: WidgetModule = {
    component: Logo,
    definition: {
        group: "Compact Header",
        icon: "diamond",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: _logoModule.definition.fieldDefinitions,
    },
};

export default widgetModule;
