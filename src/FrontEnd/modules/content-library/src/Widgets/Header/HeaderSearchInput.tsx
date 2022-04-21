import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import React from "react";

export interface HeaderSearchInputStyles {
    searchInputStyles?: SearchInputStyles;
}

export const searchInputStyles: HeaderSearchInputStyles = {};

export const HeaderSearchInput: React.FC<WidgetProps & { isAnimated?: boolean }> = ({ id, isAnimated = false }) => {
    const styles = useMergeStyles("headerSearchInput", searchInputStyles);

    return <SearchInput id={id} isAnimated={isAnimated} extendedStyles={styles.searchInputStyles} />;
};

const widgetModule: WidgetModule = {
    component: HeaderSearchInput,
    definition: {
        group: "Header",
        displayName: "Search Input",
        allowedContexts: ["Header"],
    },
};

export default widgetModule;
