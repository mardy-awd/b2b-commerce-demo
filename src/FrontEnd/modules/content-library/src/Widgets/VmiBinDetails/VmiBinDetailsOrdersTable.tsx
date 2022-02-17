import { getCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCarts from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCarts";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import resetVmiItemsSelection from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ResetVmiItemsSelection";
import selectVmiOrders from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/SelectVmiOrders";
import updateOrdersSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateOrdersSearchFields";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationId?: string }>(location.search);
    return {
        parameter: state.pages.vmiBinDetails.getVmiOrdersParameter,
        vmiOrdersDataView: getCartsDataView(state, state.pages.vmiBinDetails.getVmiOrdersParameter),
        selectedIds: state.pages.vmiBinDetails.selectedVmiItems[TableTabKeys.PreviousOrders] || {},
        parsedQuery,
    };
};

const mapDispatchToProps = {
    resetVmiItemsSelection,
    updateOrdersSearchFields,
    selectVmiOrders,
    loadCarts,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface VmiBinDetailsOrdersTableStyles {
    container?: InjectableCss;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;

    checkboxHeader?: DataTableHeaderProps;
    nameHeader?: DataTableHeaderProps;
    orderStatusHeader?: DataTableHeaderProps;
    orderDateHeader?: DataTableHeaderProps;

    checkboxCells?: DataTableCellProps;
    nameCells?: DataTableCellProps;
    orderStatusCells?: DataTableCellProps;
    orderDateCells?: DataTableCellProps;

    dataTable?: DataTableProps;
    vmiCountCheckbox?: CheckboxPresentationProps;
}

export const vmiBinDetailsOrdersTableStyles: VmiBinDetailsOrdersTableStyles = {
    container: {
        css: css`
            overflow: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    checkboxHeader: {
        tight: true,
    },
};

const styles = vmiBinDetailsOrdersTableStyles;

const VmiBinDetailsOrdersTable = ({
    parameter,
    vmiOrdersDataView,
    selectedIds,
    parsedQuery,
    resetVmiItemsSelection,
    updateOrdersSearchFields,
    selectVmiOrders,
    loadCarts,
}: Props) => {
    useEffect(() => {
        if (parameter.vmiLocationId !== parsedQuery.locationId) {
            updateOrdersSearchFields({ vmiLocationId: parsedQuery.locationId });
            return;
        }

        const pageSizeCookie = getCookie("VmiBinOrders-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== parameter.pageSize) {
            updateOrdersSearchFields({ pageSize });
            return;
        }

        if (!vmiOrdersDataView.value && !vmiOrdersDataView.isLoading) {
            loadCarts({
                apiParameter: parameter,
                onComplete: () => {
                    resetVmiItemsSelection({ tabKey: TableTabKeys.PreviousOrders });
                },
            });
        }
    });

    const headerClick = (sortField: string) => {
        const sort = parameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateOrdersSearchFields({ sort, page: 1 });
    };

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (parameter.sort === sortField) {
            sorted = "ascending";
        } else if (parameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    const vmiOrderChangeHandler = (value: boolean, id?: string) => {
        if (id) {
            selectVmiOrders({ ids: [id] });
        } else {
            let ids = [];
            if (value) {
                if (!vmiOrdersDataView.value) {
                    return;
                }
                for (const row of vmiOrdersDataView.value) {
                    if (!selectedIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(selectedIds);
            }

            selectVmiOrders({ ids });
        }
    };

    if (vmiOrdersDataView.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    if (!vmiOrdersDataView.value) {
        return null;
    }

    if (vmiOrdersDataView.value.length === 0) {
        if (parameter.page && parameter.page > 1) {
            updateOrdersSearchFields({ page: parameter.page - 1 });
            return null;
        }

        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography as="p" {...styles.noResultsText}>
                    {translate("No orders found")}
                </Typography>
            </StyledWrapper>
        );
    }

    const rows = vmiOrdersDataView.value;

    return (
        <>
            <StyledWrapper {...styles.container}>
                <DataTable {...styles.dataTable}>
                    <DataTableHead>
                        <DataTableHeader {...styles.checkboxHeader}>
                            <Checkbox
                                {...styles.vmiCountCheckbox}
                                checked={Object.keys(selectedIds).length === rows.length}
                                onChange={(e, value) => vmiOrderChangeHandler(value)}
                            />
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.nameHeader}
                            title={translate("Order Number")}
                            sorted={sorted("orderNumber")}
                            onSortClick={() => headerClick("orderNumber")}
                        >
                            {translate("Order Number")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.orderStatusHeader}
                            sorted={sorted("status")}
                            onSortClick={() => headerClick("status")}
                        >
                            {translate("Status")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.orderDateHeader}
                            sorted={sorted("orderDate")}
                            onSortClick={() => headerClick("orderDate")}
                        >
                            {translate("Order Date")}
                        </DataTableHeader>
                    </DataTableHead>
                    <DataTableBody>
                        {vmiOrdersDataView.value.map(({ id, orderNumber, status, orderDate }) => (
                            <DataTableRow key={id}>
                                <DataTableCell {...styles.checkboxCells}>
                                    <Checkbox
                                        {...styles.vmiCountCheckbox}
                                        checked={selectedIds[id]}
                                        onChange={(e, value) => vmiOrderChangeHandler(value, id)}
                                    />
                                </DataTableCell>
                                <DataTableCell {...styles.nameCells}>
                                    <Link>{orderNumber}</Link>
                                </DataTableCell>
                                <DataTableCell {...styles.orderStatusCells}>{status}</DataTableCell>
                                <DataTableCell {...styles.orderDateCells}>
                                    <LocalizedDateTime dateTime={orderDate} />
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(VmiBinDetailsOrdersTable))),
    definition: {
        group: "VMI Bin Details",
        displayName: "Search Orders Result Table",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
