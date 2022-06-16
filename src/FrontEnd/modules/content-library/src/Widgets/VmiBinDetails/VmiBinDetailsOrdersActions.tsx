import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrdersDataView } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import exportVmiOrders from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ExportVmiOrders";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    return {
        vmiOrdersState: getOrdersDataView(state, state.pages.vmiBinDetails.getVmiOrdersParameter),
        selectedIds: state.pages.vmiBinDetails.selectedVmiItems[TableTabKeys.PreviousOrders] || {},
    };
};

const mapDispatchToProps = {
    exportVmiOrders,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface VmiBinDetailsOrdersActionsStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    exportLink?: LinkPresentationProps;
    binsCountText?: TypographyPresentationProps;
}

export const vmiBinDetailsOrdersActionsStyles: VmiBinDetailsOrdersActionsStyles = {
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
const styles = vmiBinDetailsOrdersActionsStyles;

const VmiBinDetailsOrdersActions = ({ vmiOrdersState, selectedIds, exportVmiOrders }: Props) => {
    if (!vmiOrdersState.value || !vmiOrdersState.pagination) {
        return null;
    }

    const { totalItemCount } = vmiOrdersState.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const handleExportSelectedButtonClick = () => {
        exportVmiOrders({ ids: selectedIds });
    };

    const handleExportAllButtonClick = () => {
        exportVmiOrders({ ids: {} });
    };

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.gridItem}>
                    <Typography {...styles.binsCountText}>
                        {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                        {totalItemCount} {translate("Orders")}
                    </Typography>
                    <Link
                        {...styles.exportLink}
                        disabled={Object.keys(selectedIds).length === 0}
                        onClick={handleExportSelectedButtonClick}
                    >
                        {translate("Export Selected")}
                    </Link>
                    <Link {...styles.exportLink} onClick={handleExportAllButtonClick}>
                        {translate("Export All")}
                    </Link>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsOrdersActions),
    definition: {
        group: "VMI Bin Details",
        displayName: "VMI Orders Actions",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
