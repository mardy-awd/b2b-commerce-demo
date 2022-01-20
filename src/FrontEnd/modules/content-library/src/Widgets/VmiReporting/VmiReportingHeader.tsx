import toggleFiltersOpen from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/ToggleFiltersOpen";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { VmiReportingPageContext } from "@insite/content-library/Pages/VmiReportingPage";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiLocationsHeaderStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    container?: GridContainerProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: VmiLocationsHeaderStyles = {
    titleGridItem: {
        width: [11, 9, 7, 5, 6],
    },
    titleText: {
        variant: "h2",
    },
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    toggleFilterGridItem: {
        width: 12,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = headerStyles;

const VmiReportingHeader = ({ toggleFiltersOpen }: Props) => {
    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Typography as="h2" {...styles.titleText}>
                        {translate("Reporting")}
                    </Typography>
                </GridItem>
            </GridContainer>
            <GridContainer {...styles.container}>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={toggleFiltersOpen}>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(VmiReportingHeader),
    definition: {
        group: "VMI Reporting",
        allowedContexts: [VmiReportingPageContext],
    },
};

export default widgetModule;
