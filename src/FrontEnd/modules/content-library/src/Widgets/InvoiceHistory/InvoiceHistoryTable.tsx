import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import InvoiceDetailPageTypeLink from "@insite/content-library/Components/InvoiceDetailPageTypeLink";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import { ClickableProps } from "@insite/mobius/Clickable";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
    language: state.context.session.language,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryTableStyles {
    container?: InjectableCss;
    headerClickables?: ClickableProps;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableHeaders?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    dataTableCells?: DataTableCellBaseProps;
    invoiceNumberHeader?: DataTableHeaderProps;
    invoiceDateHeader?: DataTableHeaderProps;
    termsHeader?: DataTableHeaderProps;
    dueDateHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    poNumberHeader?: DataTableHeaderProps;
    statusHeader?: DataTableHeaderProps;
    totalHeader?: DataTableHeaderProps;
    currentBalanceHeader?: DataTableHeaderProps;
    invoiceNumberCell?: DataTableCellBaseProps;
    invoiceDateCell?: DataTableCellBaseProps;
    termsCell?: DataTableCellBaseProps;
    dueDateCell?: DataTableCellBaseProps;
    shipToCell?: DataTableCellBaseProps;
    poNumberCell?: DataTableCellBaseProps;
    statusCell?: DataTableCellBaseProps;
    totalCell?: DataTableCellBaseProps;
    currentBalanceCell?: DataTableCellBaseProps;
}

export const tableStyles: InvoiceHistoryTableStyles = {
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
        size: 16,
        weight: 600,
    },
    headerClickables: {
        css: css`
            &:focus {
                outline-style: none;
            }
            width: 100%;
            justify-content: space-between;
            display: block;
        `, // TODO ISC-12604 focus removal is incorrect
    },
    totalHeader: {
        alignX: "right",
    },
    currentBalanceHeader: {
        alignX: "right",
    },
    totalCell: {
        alignX: "right",
    },
    currentBalanceCell: {
        alignX: "right",
    },
};

const styles = tableStyles;

const InvoiceHistoryTable = (props: Props) => {
    const headerClick = (sortField: string) => {
        const sort = props.getInvoicesParameter.sort === sortField ? `${sortField} DESC` : sortField;
        props.updateSearchFields({ sort });
    };

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (props.getInvoicesParameter.sort === sortField) {
            sorted = "ascending";
        } else if (props.getInvoicesParameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    const invoicesDataView = useContext(InvoicesDataViewContext);
    if (!invoicesDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    if (invoicesDataView.value.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No invoices found")}</Typography>
            </StyledWrapper>
        );
    }

    const rows = invoicesDataView.value.map(invoice => {
        return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            date: invoice.invoiceDate
                ? getLocalizedDateTime({
                      dateTime: new Date(invoice.invoiceDate),
                      language: props.language,
                  })
                : "",
            terms: invoice.terms,
            dueDate: invoice.dueDate
                ? getLocalizedDateTime({
                      dateTime: new Date(invoice.dueDate),
                      language: props.language,
                  })
                : "",
            shipTo: `${invoice.stCompanyName} ${invoice.btAddress1} ${invoice.btAddress2} ${invoice.shipToCity} ${invoice.shipToState}`,
            customerPO: invoice.customerPO,
            status: invoice.status,
            total: invoice.invoiceTotalDisplay,
            currentBalance: invoice.currentBalanceDisplay,
        };
    });

    return (
        <StyledWrapper {...styles.container}>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader
                        tight
                        sorted={sorted("invoiceNumber")}
                        {...styles.invoiceNumberHeader}
                        onSortClick={() => headerClick("invoiceNumber")}
                    >
                        {translate("Invoice #")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("invoiceDate")}
                        {...styles.invoiceDateHeader}
                        onSortClick={() => headerClick("invoiceDate")}
                    >
                        {translate("Invoice Date")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("terms")}
                        {...styles.termsHeader}
                        onSortClick={() => headerClick("terms")}
                    >
                        {translate("Terms")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("dueDate")}
                        {...styles.dueDateHeader}
                        onSortClick={() => headerClick("dueDate")}
                    >
                        {translate("Due Date")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("stCompanyName")}
                        {...styles.shipToHeader}
                        onSortClick={() => headerClick("stCompanyName")}
                    >
                        {translate("Ship To / Pick Up")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("customerPO")}
                        {...styles.poNumberHeader}
                        onSortClick={() => headerClick("customerPO")}
                    >
                        {translate("PO #")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("status")}
                        {...styles.statusHeader}
                        onSortClick={() => headerClick("status")}
                    >
                        {translate("Status")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("invoiceTotal")}
                        {...styles.totalHeader}
                        onSortClick={() => headerClick("invoiceTotal")}
                    >
                        {translate("Invoice Total")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("currentBalance")}
                        {...styles.currentBalanceHeader}
                        onSortClick={() => headerClick("currentBalance")}
                    >
                        {translate("Current Balance")}
                    </DataTableHeader>
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(
                        ({
                            id,
                            invoiceNumber,
                            date,
                            terms,
                            dueDate,
                            shipTo,
                            customerPO,
                            status,
                            total,
                            currentBalance,
                        }) => (
                            <DataTableRow
                                key={id}
                                {...styles.dataTableRow}
                                data-test-selector="invoiceHistory_invoiceLine"
                            >
                                <DataTableCell
                                    {...styles.invoiceNumberCell}
                                    data-test-selector="invoiceHistory_invoiceLine_number"
                                >
                                    <InvoiceDetailPageTypeLink title={invoiceNumber} invoiceNumber={invoiceNumber} />
                                </DataTableCell>
                                <DataTableCell
                                    {...styles.invoiceDateCell}
                                    data-test-selector="invoiceHistory_invoiceLine_date"
                                >
                                    {date}
                                </DataTableCell>
                                <DataTableCell {...styles.termsCell}>{terms}</DataTableCell>
                                <DataTableCell {...styles.dueDateCell}>{dueDate}</DataTableCell>
                                <DataTableCell {...styles.shipToCell}>{shipTo}</DataTableCell>
                                <DataTableCell {...styles.poNumberCell}>{customerPO}</DataTableCell>
                                <DataTableCell {...styles.statusCell}>{status}</DataTableCell>
                                <DataTableCell {...styles.totalCell}>{total}</DataTableCell>
                                <DataTableCell {...styles.currentBalanceCell}>{currentBalance}</DataTableCell>
                            </DataTableRow>
                        ),
                    )}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryTable),
    definition: {
        group: "Invoice History",
        displayName: "Search Results Table",
        allowedContexts: [InvoiceHistoryPageContext],
    },
};

export default widgetModule;
