import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import _searchModule from "@insite/content-library/Widgets/Header/HeaderSearchInput";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

export interface SearchStyles {
    searchWrapper?: InjectableCss;
}

export const searchStyles: SearchStyles = {
    searchWrapper: {
        css: css`
            display: flex;
            align-items: center;
            height: 100%;
        `,
    },
};

const styles = searchStyles;

function Search(props: any) {
    const headerSearchInput = createWidgetElement("Header/HeaderSearchInput", { ...props, isAnimated: true });

    return <StyledWrapper {...styles.searchWrapper}>{headerSearchInput}</StyledWrapper>;
}

const widgetModule: WidgetModule = {
    component: Search,
    definition: {
        group: "Compact Header",
        icon: "magnifying-glass",
        allowedContexts: ["CompactHeader"],
        fieldDefinitions: _searchModule.definition.fieldDefinitions,
    },
};

export default widgetModule;
