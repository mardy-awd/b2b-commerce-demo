import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import exportOrders from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/ExportOrders";
import reorder from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/Reorder";
import selectOrders from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/SelectOrders";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import { ClickableProps } from "@insite/mobius/Clickable";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import HistoryContext, { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showOrderNumber = "showOrderNumber",
    showDate = "showDate",
    showOrderTotal = "showOrderTotal",
    showStatus = "showStatus",
    showShipTo = "showShipTo",
    showPONumber = "showPONumber",
    showReorderProducts = "showReorderProducts",
}

type sortByField = {
    [key: string]: string[];
};

const sortByFields: sortByField = {
    webOrderNumber: ["webOrderNumber"],
    orderDate: ["orderDate", "erpOrderNumber"],
    orderTotal: ["orderTotal"],
    status: ["status"],
    stCompanyName: ["stCompanyName"],
    customerPO: ["customerPO"],
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showOrderNumber]: boolean;
        [fields.showDate]: boolean;
        [fields.showOrderTotal]: boolean;
        [fields.showStatus]: boolean;
        [fields.showShipTo]: boolean;
        [fields.showPONumber]: boolean;
        [fields.showReorderProducts]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.getOrdersParameter,
        isReordering: state.pages.orderHistory.isReordering,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        language: state.context.session.language,
        showPoNumber: getSettingsCollection(state).orderSettings.showPoNumber,
        isVmiOrderHistoryPage: state.pages.orderHistory.isVmiOrderHistoryPage,
        selectedOrderIds: state.pages.orderHistory.selectedOrderIds || {},
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    reorder,
    selectOrders,
    exportOrders,
};

type Props = ReturnType<typeof mapStateToProps> &
    OwnProps &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface OrderHistoryTableStyles {
    container?: InjectableCss;
    headerClickable?: ClickableProps;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    orderDateHeader?: DataTableHeaderProps;
    orderNumberHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    statusHeader?: DataTableHeaderProps;
    customerPOHeader?: DataTableHeaderProps;
    orderTotalHeader?: DataTableHeaderProps;
    reorderHeader?: DataTableHeaderProps;
    orderDateCells?: DataTableCellProps;
    orderNumberCells?: DataTableCellProps;
    shipToCells?: DataTableCellProps;
    statusCells?: DataTableCellProps;
    customerPOCells?: DataTableCellProps;
    orderTotalCells?: DataTableCellProps;
    reorderCells?: DataTableCellProps;
    reorderButton?: ButtonPresentationProps;
    reorderButtonSpinner?: LoadingSpinnerProps;
    orderNumberLink?: LinkPresentationProps;
    dataTable?: DataTableProps;
    checkboxHeader?: DataTableHeaderProps;
    checkboxCells?: DataTableCellProps;
    rowCheckbox?: CheckboxPresentationProps;
    headerContainer?: GridContainerProps;
    gridItem?: GridItemProps;
    exportLink?: LinkPresentationProps;
}

export const orderHistoryTableStyles: OrderHistoryTableStyles = {
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
    headerClickable: {
        css: css`
            width: 100%;
            justify-content: space-between;
        `,
    },
    reorderButton: {
        color: "secondary",
        sizeVariant: "medium",
    },
    reorderButtonSpinner: {
        size: 22,
        css: css`
            margin-left: auto;
            margin-right: auto;
            display: block;
        `,
    },
    shipToHeader: {
        tight: true,
    },
    orderTotalHeader: {
        tight: true,
        alignX: "right",
    },
    reorderHeader: {
        tight: true,
    },
    orderTotalCells: {
        alignX: "right",
    },
    shipToCells: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 300px;
            `,
        },
    },
    checkboxHeader: {
        tight: true,
    },
    headerContainer: {
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
            margin-left: 10px;
        `,
    },
};

const styles = orderHistoryTableStyles;

class OrderHistoryTable extends React.Component<Props> {
    static contextType = OrdersDataViewContext;
    context!: React.ContextType<typeof OrdersDataViewContext>;

    headerClick(sortField: string) {
        const previousSort = this.props.parameter.sort ?? "";
        const [previousPrimaryField] = previousSort.split(",");
        const direction = previousPrimaryField === sortField ? " DESC" : "";
        const sort = sortByFields[sortField].map(field => `${field}${direction}`).join(", ");
        this.props.updateSearchFields({ sort });
    }

    sorted = (sortField: string) => {
        let sorted: boolean | string = false;

        if (!this.props.parameter.sort) {
            return sorted;
        }
        const [primaryField] = this.props.parameter.sort.split(",");
        if (primaryField === sortField) {
            sorted = "ascending";
        } else if (primaryField === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    reorderClick = (orderNumber: string, linkOrderNumber: string, isVmiOrder: boolean) =>
        this.props.reorder({
            orderNumber,
            onSuccess: () => this.onReorderSuccess(orderNumber, linkOrderNumber, isVmiOrder),
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    this.onSuccess?.();
                }
            },
        });

    onReorderSuccess = (orderNumber: string, linkOrderNumber: string, isVmiOrder: boolean) => {
        if (!this.props.showAddToCartConfirmationDialog) {
            return;
        }
        this.props.toaster.addToast({
            body: (
                <HistoryContext.Provider value={{ history: this.props.history }}>
                    <OrderDetailPageTypeLink
                        title={orderNumber}
                        orderNumber={linkOrderNumber}
                        isVmiOrder={isVmiOrder}
                        isVmiOrderDetailsPage={this.props.isVmiOrderHistoryPage}
                    />
                    &nbsp;{translate("Added to Cart")}
                </HistoryContext.Provider>
            ),
            messageType: "success",
            timeoutLength: 6000,
        });
    };

    render() {
        const ordersDataView = this.context;
        if (ordersDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!ordersDataView.value) {
            return null;
        }

        if (ordersDataView.value.length === 0) {
            return (
                <StyledWrapper {...styles.noResultsContainer}>
                    <Typography as="p" {...styles.noResultsText} data-test-selector="orderHistoryTable_noOrdersFound">
                        {translate("No orders found")}
                    </Typography>
                </StyledWrapper>
            );
        }

        const rows = ordersDataView.value.map(order => {
            return {
                id: order.id,
                linkOrderNumber: order.webOrderNumber || order.erpOrderNumber,
                date: order.orderDate
                    ? getLocalizedDateTime({
                          dateTime: new Date(order.orderDate),
                          language: this.props.language,
                      })
                    : "",
                orderNumber: order.webOrderNumber || order.erpOrderNumber,
                shipTo: `${order.stCompanyName} ${order.stAddress1} ${order.stAddress2} ${order.shipToCity} ${order.shipToState}`,
                status: order.statusDisplay,
                po: order.customerPO,
                total: order.orderGrandTotalDisplay,
                isVmiOrder: !!order.vmiLocationId,
            };
        });

        const { showOrderNumber, showDate, showOrderTotal, showStatus, showShipTo, showPONumber, showReorderProducts } =
            this.props.fields;

        const isTrueOrUndefined = (value?: boolean) => value === true || value === undefined;

        const checkboxChangeHandler = (value: boolean, id?: string) => {
            if (id) {
                this.props.selectOrders({ ids: [id] });
            } else {
                let ids: string[] = [];
                if (value) {
                    for (const row of this.context.value!) {
                        if (!this.props.selectedOrderIds[row.id]) {
                            ids.push(row.id);
                        }
                    }
                } else {
                    ids = Object.keys(this.props.selectedOrderIds);
                }

                this.props.selectOrders({ ids });
            }
        };

        const handleExportButtonClick = (selectedOnly = false) => {
            this.props.exportOrders({ ids: selectedOnly ? this.props.selectedOrderIds : {} });
        };

        return (
            <StyledWrapper {...styles.container} data-test-selector="orderHistoryTable">
                {rows.length > 0 && this.props.isVmiOrderHistoryPage && (
                    <GridContainer {...styles.headerContainer}>
                        <GridItem {...styles.gridItem}>
                            <>
                                <Link
                                    disabled={Object.keys(this.props.selectedOrderIds).length === 0}
                                    onClick={() => handleExportButtonClick(true)}
                                >
                                    {translate("Export Selected")}
                                </Link>
                                <Link {...styles.exportLink} onClick={() => handleExportButtonClick()}>
                                    {translate("Export All")}
                                </Link>
                            </>
                        </GridItem>
                    </GridContainer>
                )}
                <DataTable {...styles.dataTable}>
                    <DataTableHead>
                        {this.props.isVmiOrderHistoryPage && (
                            <DataTableHeader {...styles.checkboxHeader}>
                                <Checkbox
                                    {...styles.rowCheckbox}
                                    checked={
                                        Object.keys(this.props.selectedOrderIds).length === ordersDataView.value.length
                                    }
                                    onChange={(e, value) => checkboxChangeHandler(value)}
                                />
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showOrderNumber) && (
                            <DataTableHeader
                                {...styles.orderNumberHeader}
                                title={translate("Order Number")}
                                sorted={this.sorted("webOrderNumber")}
                                onSortClick={() => this.headerClick("webOrderNumber")}
                            >
                                {translate("Order #", "webOrderNumber")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showDate) && (
                            <DataTableHeader
                                {...styles.orderDateHeader}
                                sorted={this.sorted("orderDate")}
                                onSortClick={() => this.headerClick("orderDate")}
                                data-test-selector="tableHeader_OrderDate"
                            >
                                {translate("Date", "orderDate")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showOrderTotal) && (
                            <DataTableHeader
                                {...styles.orderTotalHeader}
                                sorted={this.sorted("orderTotal")}
                                onSortClick={() => this.headerClick("orderTotal")}
                            >
                                {translate("Order Total", "orderTotal")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showStatus) && (
                            <DataTableHeader
                                {...styles.statusHeader}
                                sorted={this.sorted("status")}
                                onSortClick={() => this.headerClick("status")}
                            >
                                {translate("Status", "status")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showShipTo) && (
                            <DataTableHeader
                                {...styles.shipToHeader}
                                sorted={this.sorted("stCompanyName")}
                                onSortClick={() => this.headerClick("stCompanyName")}
                            >
                                {translate("Ship To / Pick Up", "stCompanyName")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showPONumber) && this.props.showPoNumber && (
                            <DataTableHeader
                                {...styles.customerPOHeader}
                                title={translate("Purchase Order Number")}
                                sorted={this.sorted("customerPO")}
                                onSortClick={() => this.headerClick("customerPO")}
                            >
                                {translate("PO #", "customerPO")}
                            </DataTableHeader>
                        )}
                        {isTrueOrUndefined(showReorderProducts) && !this.props.isVmiOrderHistoryPage && (
                            <DataTableHeader {...styles.reorderHeader} title={translate("Reorder")} />
                        )}
                    </DataTableHead>
                    <DataTableBody data-test-selector="orderHistoryTable_tableBody">
                        {rows.map(
                            ({ id, linkOrderNumber, date, orderNumber, shipTo, status, po, total, isVmiOrder }) => (
                                <DataTableRow key={id}>
                                    {this.props.isVmiOrderHistoryPage && (
                                        <DataTableCell {...styles.checkboxCells}>
                                            <Checkbox
                                                {...styles.rowCheckbox}
                                                checked={this.props.selectedOrderIds[id]}
                                                onChange={(e, value) => checkboxChangeHandler(value, id)}
                                            />
                                        </DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showOrderNumber) && (
                                        <DataTableCell
                                            {...styles.orderNumberCells}
                                            data-test-selector="orderHistoryTable_tableCell_orderNumber"
                                        >
                                            <OrderDetailPageTypeLink
                                                title={orderNumber}
                                                orderNumber={linkOrderNumber}
                                                isVmiOrder={isVmiOrder}
                                                isVmiOrderDetailsPage={this.props.isVmiOrderHistoryPage}
                                            />
                                        </DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showDate) && (
                                        <DataTableCell
                                            {...styles.orderDateCells}
                                            data-test-selector="orderHistoryTable_tableCell_date"
                                        >
                                            {date}
                                        </DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showOrderTotal) && (
                                        <DataTableCell {...styles.orderTotalCells}>{total}</DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showStatus) && (
                                        <DataTableCell
                                            {...styles.statusCells}
                                            data-test-selector="orderHistoryTable_tableCell_status"
                                        >
                                            {status}
                                        </DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showShipTo) && (
                                        <DataTableCell {...styles.shipToCells}>{shipTo}</DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showPONumber) && this.props.showPoNumber && (
                                        <DataTableCell {...styles.customerPOCells}>{po}</DataTableCell>
                                    )}
                                    {isTrueOrUndefined(showReorderProducts) && !this.props.isVmiOrderHistoryPage && (
                                        <DataTableCell {...styles.reorderCells}>
                                            {this.props.isReordering[orderNumber] ? (
                                                <LoadingSpinner {...styles.reorderButtonSpinner} />
                                            ) : (
                                                <Button
                                                    disabled={Object.keys(this.props.isReordering).length > 0}
                                                    {...styles.reorderButton}
                                                    onClick={() =>
                                                        this.reorderClick(orderNumber, linkOrderNumber, isVmiOrder)
                                                    }
                                                    data-test-selector="orderHistoryTable_Reorder"
                                                >
                                                    {translate("Reorder")}
                                                </Button>
                                            )}
                                        </DataTableCell>
                                    )}
                                </DataTableRow>
                            ),
                        )}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(OrderHistoryTable))),
    definition: {
        group: "Order History",
        displayName: "Search Results Table",
        allowedContexts: ["OrderHistoryPage", "VmiOrderHistoryPage"],
        fieldDefinitions: [
            {
                name: fields.showOrderNumber,
                displayName: "Order #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 0,
            },
            {
                name: fields.showDate,
                displayName: "Date",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showOrderTotal,
                displayName: "Order Total",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showStatus,
                displayName: "Status",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.showShipTo,
                displayName: "Ship To/Pick Up",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showPONumber,
                displayName: "PO #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showReorderProducts,
                displayName: "Reorder",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 6,
            },
        ],
    },
};

export default widgetModule;
