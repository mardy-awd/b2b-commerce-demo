import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _mainNavigation from "@insite/content-library/Widgets/Header/MainNavigation";
import * as cssLinter from "css";

const enum fields {
    customCSS = "customCSS",
}

const defaultCustomCss = `.flyout-menu-wrapper {
}

.menu-trigger-button {
}

.menu-trigger-button-icon {
}

.drawer {
}

.drawer-section-wrapper {
}

.panel-menu {
}

.main-navigation-row {
}

.panel-section-wrapper {
}

.main-navigation-row-icon {
}

.user-row-text {
}

.punch-out-navigation-row-icon {
}

.punch-out-user-row-text {
}

.main-navigation-row-text {
}

.logo-links-row {
}

.logo-link-title {
}

.language-image {
}

.menu-row-icon {
}

.change-customer-row {
}

.change-customer-row-container {
}

.fulfillment-method-grid-item {
}

.addresses-grid-item {
}

.pick-up-address-grid-item {
}

.apply-button-grid-item {
}

.sign-out-row {
}

.sign-out-row-text {
}`;

function Flyout(props: any) {
    return createWidgetElement("Header/MainNavigation", {
        ...props,
        isCompactHeaderFlyoutMenu: true,
        flyoutCustomCSS: props.fields.customCSS,
    });
}

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const flyout: WidgetModule = {
    component: Flyout,
    definition: {
        group: "Compact Header",
        icon: "magnifying-glass",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: [
            ...(_mainNavigation.definition.fieldDefinitions?.filter(o => o.name !== "customCSS") || []),
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
export default flyout;
