import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _mainNavigationModule from "@insite/content-library/Widgets/Header/MainNavigation";
import * as cssLinter from "css";

const enum fields {
    customCSS = "customCSS",
}

const defaultCustomCss = `.container {
}

.item-wrapper {
}

.cascading-menu {
}

.menu-item {
}

.mega-menu {
}

.mega-menu-grid-container {
}

.mega-menu-grid-item {
}

.mega-menu-heading-link {
}

.mega-menu-link {
}

.quick-order-item-wrapper {
}

.quick-order-link {
}`;

function MainNavigation(props: any) {
    return createWidgetElement("Header/MainNavigation", {
        ...props,
        isCompactHeaderMainNavigation: true,
        сompactHeaderMainNavigationCustomCSS: props.fields.customCSS,
    });
}

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: MainNavigation,
    definition: {
        group: "Compact Header",
        icon: "magnifying-glass",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: [
            ...(_mainNavigationModule.definition.fieldDefinitions?.filter(o => o.name !== "customCSS") || []),
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

// eslint-disable-next-line spire/export-styles
export default widgetModule;
