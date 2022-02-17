import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { VmiBinsDataViewContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import exportVmiProducts from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/ExportVmiProducts";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedIds: state.pages.vmiReporting.selectedVmiBins,
        isRemoving: state.data.vmiBins.isRemoving,
    };
};

const mapDispatchToProps = {
    exportVmiProducts,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface OrderHistoryHeaderStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    exportLink?: LinkPresentationProps;
    binsCountText?: TypographyPresentationProps;
}

export const headerStyles: OrderHistoryHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding: 20px 0;
        `,
    },
    gridItem: {
        width: 12,
        css: css`
            > * {
                padding-right: 10px;
            }
        `,
    },
    exportLink: {
        css: css`
            margin-left: 15px;
        `,
    },
};
const styles = headerStyles;

const VmiBinsActions = ({ selectedIds, exportVmiProducts, isRemoving }: Props) => {
    const vmiBinsDataView = useContext(VmiBinsDataViewContext);

    if (!vmiBinsDataView.value || !vmiBinsDataView.pagination) {
        return null;
    }

    const { totalItemCount } = vmiBinsDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const handleExportSelectedButtonClick = () => {
        exportVmiProducts({ ids: selectedIds });
    };

    const handleExportAllButtonClick = () => {
        exportVmiProducts({ ids: {} });
    };

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.gridItem}>
                    <Typography {...styles.binsCountText}>
                        {totalItemCount} {translate("Products")}
                    </Typography>
                    <Link
                        {...styles.exportLink}
                        disabled={isRemoving || Object.keys(selectedIds).length === 0}
                        onClick={handleExportSelectedButtonClick}
                    >
                        {translate("Export Selected")}
                    </Link>
                    <Link {...styles.exportLink} disabled={isRemoving} onClick={handleExportAllButtonClick}>
                        {translate("Export All")}
                    </Link>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinsActions),
    definition: {
        group: "VMI Reporting",
        allowedContexts: ["VmiReportingPage"],
    },
};

export default widgetModule;
