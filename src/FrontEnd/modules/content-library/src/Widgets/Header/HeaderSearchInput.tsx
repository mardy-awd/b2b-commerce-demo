import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import * as cssLinter from "css";
import React from "react";
import { css } from "styled-components";

const enum fields {
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.customCSS]: string;
    };
}

export interface HeaderSearchInputStyles {
    searchInputStyles?: SearchInputStyles;
}

export const searchInputStyles: HeaderSearchInputStyles = {};

const defaultCustomCss = `.search-input{
}

.popover{
}

.autocomplete-wrapper{
}

.autocomplete-column-wrapper{
}

.autocomplete-categories-header{
}

.autocomplete-categories-item-text{
}

.autocomplete-categories-item-link{
}

.autocomplete-categories-link{
}

.autocomplete-brands-header{
}

.autocomplete-brands-item-text{
}

.autocomplete-brands-item-link{
}

.autocomplete-brands-link{
}

.autocomplete-content-header{
}

.autocomplete-content-link{
}

.autocomplete-products-header{
}

.autocomplete-products-container{
}

.autocomplete-products-image-grid-item{
}

.autocomplete-products-image{
}

.autocomplete-products-info-grid-item{
}

.autocomplete-products-link{
}

.autocomplete-products-erp-number{
}`;

export const HeaderSearchInput: React.FC<OwnProps & { isAnimated?: boolean }> = ({
    id,
    fields,
    isAnimated = false,
}) => {
    const styles = useMergeStyles("headerSearchInput", searchInputStyles);

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <SearchInput id={id} isAnimated={isAnimated} extendedStyles={styles.searchInputStyles} />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: HeaderSearchInput,
    definition: {
        group: "Header",
        displayName: "Search Input",
        allowedContexts: ["Header"],
        fieldDefinitions: [
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
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
