import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _logoModule, { LogoStyles } from "@insite/content-library/Widgets/Basic/Logo";
import * as cssLinter from "css";

const enum fields {
    customCSS = "customCSS",
}

const defaultCustomCss = `.wrapper {
}

.home-page-link {
}

.img {
}
`;

export const extendedStyles: LogoStyles = {};

function Logo(props: any) {
    return createWidgetElement("Basic/Logo", {
        extendedStyles,
        ...props,
        externalCustomCSS: props.fields.customCSS,
    });
}

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: Logo,
    definition: {
        group: "Compact Header",
        icon: "diamond",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: [
            ...(_logoModule.definition.fieldDefinitions?.filter(o => o.name !== "customCSS") || []),
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
