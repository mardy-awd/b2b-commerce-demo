import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { VmiBinsDataViewContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import selectVmiBins from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/SelectVmiBins";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
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
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showShortDescription = "showShortDescription",
    showErpNumber = "showErpNumber",
    showManufacturerItem = "showManufacturerItem",
    showCustomerName = "showCustomerName",
    showBinNumber = "showBinNumber",
    showMinimumQty = "showMinimumQty",
    showMaximumQty = "showMaximumQty",
    showPreviousCountDate = "showPreviousCountDate",
    showPreviousCountQty = "showPreviousCountQty",
    showLastOrderLineId = "showLastOrderLineId",
}

export interface VmiBinsTableProps extends WidgetProps {
    fields: {
        [fields.showShortDescription]: boolean;
        [fields.showErpNumber]: boolean;
        [fields.showManufacturerItem]: boolean;
        [fields.showCustomerName]: boolean;
        [fields.showBinNumber]: boolean;
        [fields.showMinimumQty]: boolean;
        [fields.showMaximumQty]: boolean;
        [fields.showPreviousCountDate]: boolean;
        [fields.showPreviousCountQty]: boolean;
        [fields.showLastOrderLineId]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.vmiReporting.getVmiBinsParameter,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        selectedIds: state.pages.vmiReporting.selectedVmiBins,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    selectVmiBins,
};

type Props = VmiBinsTableProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface VmiBinsTableStyles {
    container?: InjectableCss;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;

    checkboxHeader?: DataTableHeaderProps;
    nameHeader?: DataTableHeaderProps;
    erpNumberHeader?: DataTableHeaderProps;
    manufacturerItemHeader?: DataTableHeaderProps;
    customerNameHeader?: DataTableHeaderProps;
    binNumberHeader?: DataTableHeaderProps;
    minimumQtyHeader?: DataTableHeaderProps;
    maximumQtyHeader?: DataTableHeaderProps;
    previousCountDateHeader?: DataTableHeaderProps;
    previousCountQtyHeader?: DataTableHeaderProps;
    previousOrderHeader?: DataTableHeaderProps;

    checkboxCells?: DataTableCellProps;
    nameCells?: DataTableCellProps;
    erpNumberCells?: DataTableCellProps;
    manufacturerItemCells?: DataTableCellProps;
    customerNameCells?: DataTableCellProps;
    binNumberCells?: DataTableCellProps;
    minimumQtyCells?: DataTableCellProps;
    maximumQtyCells?: DataTableCellProps;
    previousCountDateCells?: DataTableCellProps;
    previousCountQtyCells?: DataTableCellProps;
    previousOrderCells?: DataTableCellProps;

    dataTable?: DataTableProps;
    binCheckbox?: CheckboxPresentationProps;
}

export const vmiBinsTableStyles: VmiBinsTableStyles = {
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
    erpNumberHeader: {
        tight: true,
    },
    checkboxHeader: {
        tight: true,
    },
    nameCells: {
        css: css`
            max-width: 330px;
            a {
                text-overflow: ellipsis;
                overflow: hidden;
                display: block;
            }
        `,
    },
};

const styles = vmiBinsTableStyles;

class VmiBinsTable extends React.Component<Props> {
    static contextType = VmiBinsDataViewContext;
    context!: React.ContextType<typeof VmiBinsDataViewContext>;

    headerClick(sortField: string) {
        const sort = this.props.parameter.sort === sortField ? `${sortField} DESC` : sortField;
        this.props.updateSearchFields({ sort, page: 1 });
    }

    sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (this.props.parameter.sort === sortField) {
            sorted = "ascending";
        } else if (this.props.parameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    binChangeHandler = (value: boolean, id?: string) => {
        if (id) {
            this.props.selectVmiBins({ ids: [id] });
        } else {
            let ids = [];
            if (value) {
                const vmiBinsDataView = this.context;
                if (!vmiBinsDataView.value) {
                    return;
                }
                for (const row of vmiBinsDataView.value) {
                    if (!this.props.selectedIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(this.props.selectedIds);
            }

            this.props.selectVmiBins({ ids });
        }
    };

    render() {
        const vmiBinsDataView = this.context;

        if (vmiBinsDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!vmiBinsDataView.value) {
            return null;
        }

        if (vmiBinsDataView.value.length === 0) {
            if (this.props.parameter.page && this.props.parameter.page > 1) {
                this.props.updateSearchFields({ page: this.props.parameter.page - 1 });
                return null;
            }

            return (
                <StyledWrapper {...styles.noResultsContainer}>
                    <Typography as="p" {...styles.noResultsText}>
                        {translate("No products found")}
                    </Typography>
                </StyledWrapper>
            );
        }

        const rows = vmiBinsDataView.value;

        return (
            <>
                <StyledWrapper {...styles.container}>
                    <DataTable {...styles.dataTable}>
                        <DataTableHead>
                            <DataTableHeader {...styles.checkboxHeader}>
                                <Checkbox
                                    {...styles.binCheckbox}
                                    checked={Object.keys(this.props.selectedIds).length === rows.length}
                                    onChange={(e, value) => this.binChangeHandler(value)}
                                />
                            </DataTableHeader>
                            <DataTableHeader
                                {...styles.nameHeader}
                                title={translate("Product Name")}
                                sorted={this.sorted("product.shortDescription")}
                                onSortClick={() => this.headerClick("product.shortDescription")}
                            >
                                {translate("Product Name")}
                            </DataTableHeader>
                            <DataTableHeader
                                {...styles.erpNumberHeader}
                                sorted={this.sorted("product.erpNumber")}
                                onSortClick={() => this.headerClick("product.erpNumber")}
                            >
                                {translate("Part #")}
                            </DataTableHeader>
                            {this.props.fields.showManufacturerItem && (
                                <DataTableHeader
                                    {...styles.manufacturerItemHeader}
                                    sorted={this.sorted("product.manufacturerItem")}
                                    onSortClick={() => this.headerClick("product.manufacturerItem")}
                                >
                                    {translate("Manufacture #")}
                                </DataTableHeader>
                            )}
                            {this.props.fields.showCustomerName && (
                                <DataTableHeader
                                    {...styles.customerNameHeader}
                                    sorted={this.sorted("product.customerName")}
                                    onSortClick={() => this.headerClick("product.customerName")}
                                >
                                    {translate("My Part #")}
                                </DataTableHeader>
                            )}
                            {this.props.fields.showBinNumber && (
                                <DataTableHeader
                                    {...styles.binNumberHeader}
                                    sorted={this.sorted("binNumber")}
                                    onSortClick={() => this.headerClick("binNumber")}
                                >
                                    {translate("Bin #")}
                                </DataTableHeader>
                            )}
                            <DataTableHeader
                                {...styles.minimumQtyHeader}
                                sorted={this.sorted("minimumQty")}
                                onSortClick={() => this.headerClick("minimumQty")}
                            >
                                {translate("Min")}
                            </DataTableHeader>
                            <DataTableHeader
                                {...styles.maximumQtyHeader}
                                sorted={this.sorted("maximumQty")}
                                onSortClick={() => this.headerClick("maximumQty")}
                            >
                                {translate("Max")}
                            </DataTableHeader>
                            {this.props.fields.showPreviousCountDate && (
                                <DataTableHeader
                                    {...styles.previousCountDateHeader}
                                    sorted={this.sorted("previousCountDate")}
                                    onSortClick={() => this.headerClick("previousCountDate")}
                                >
                                    {translate("Previous Count Date")}
                                </DataTableHeader>
                            )}
                            {this.props.fields.showPreviousCountQty && (
                                <DataTableHeader
                                    {...styles.previousCountQtyHeader}
                                    sorted={this.sorted("previousCountQty")}
                                    onSortClick={() => this.headerClick("previousCountQty")}
                                >
                                    {translate("Previous Count Quantity")}
                                </DataTableHeader>
                            )}
                            {this.props.fields.showLastOrderLineId && (
                                <DataTableHeader
                                    {...styles.previousOrderHeader}
                                    sorted={this.sorted("lastOrderLineId")}
                                    onSortClick={() => this.headerClick("lastOrderLineId")}
                                >
                                    {translate("Previous Order")}
                                </DataTableHeader>
                            )}
                        </DataTableHead>
                        <DataTableBody>
                            {rows.map(
                                ({
                                    id,
                                    product: {
                                        shortDescription,
                                        erpNumber,
                                        manufacturerItem,
                                        customerName,
                                        productDetailUrl,
                                    },
                                    binNumber,
                                    minimumQty,
                                    maximumQty,
                                    previousCountDate,
                                    previousCountQty,
                                    lastOrderErpOrderNumber,
                                    lastOrderWebOrderNumber,
                                }) => (
                                    <DataTableRow key={id}>
                                        <DataTableCell {...styles.checkboxCells}>
                                            <Checkbox
                                                {...styles.binCheckbox}
                                                checked={this.props.selectedIds[id]}
                                                onChange={(e, value) => this.binChangeHandler(value, id)}
                                            />
                                        </DataTableCell>
                                        <DataTableCell {...styles.nameCells}>
                                            <Link title={shortDescription} href={productDetailUrl}>
                                                {shortDescription}
                                            </Link>
                                        </DataTableCell>
                                        <DataTableCell {...styles.erpNumberCells}>{erpNumber}</DataTableCell>
                                        {this.props.fields.showManufacturerItem && (
                                            <DataTableCell {...styles.manufacturerItemCells}>
                                                {manufacturerItem}
                                            </DataTableCell>
                                        )}
                                        {this.props.fields.showCustomerName && (
                                            <DataTableCell {...styles.customerNameCells}>{customerName}</DataTableCell>
                                        )}
                                        {this.props.fields.showBinNumber && (
                                            <DataTableCell {...styles.binNumberCells}>{binNumber}</DataTableCell>
                                        )}
                                        <DataTableCell {...styles.minimumQtyCells}>{minimumQty}</DataTableCell>
                                        <DataTableCell {...styles.maximumQtyCells}>{maximumQty}</DataTableCell>
                                        {this.props.fields.showPreviousCountDate && (
                                            <DataTableCell {...styles.previousCountDateCells}>
                                                <LocalizedDateTime dateTime={previousCountDate} />
                                            </DataTableCell>
                                        )}
                                        {this.props.fields.showPreviousCountQty && (
                                            <DataTableCell {...styles.previousCountQtyCells}>
                                                {previousCountQty}
                                            </DataTableCell>
                                        )}
                                        {this.props.fields.showLastOrderLineId && (
                                            <DataTableCell {...styles.previousOrderCells}>
                                                {(lastOrderErpOrderNumber || lastOrderWebOrderNumber) && (
                                                    <OrderDetailPageTypeLink
                                                        title={lastOrderErpOrderNumber || lastOrderWebOrderNumber}
                                                        orderNumber={lastOrderErpOrderNumber || lastOrderWebOrderNumber}
                                                    />
                                                )}
                                            </DataTableCell>
                                        )}
                                    </DataTableRow>
                                ),
                            )}
                        </DataTableBody>
                    </DataTable>
                </StyledWrapper>
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(VmiBinsTable))),
    definition: {
        group: "VMI Reporting",
        displayName: "Search Results Table",
        allowedContexts: ["VmiReportingPage"],
        fieldDefinitions: [
            {
                name: fields.showShortDescription,
                displayName: "Product Name",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 0,
            },
            {
                name: fields.showErpNumber,
                displayName: "Part #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showManufacturerItem,
                displayName: "Manufacture #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showCustomerName,
                displayName: "My Part #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.showBinNumber,
                displayName: "Bin #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showMinimumQty,
                displayName: "Min",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showMaximumQty,
                displayName: "Max",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 6,
            },
            {
                name: fields.showPreviousCountDate,
                displayName: "Previous Count Date",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 7,
            },
            {
                name: fields.showPreviousCountQty,
                displayName: "Previous Count Quantity",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 8,
            },
            {
                name: fields.showLastOrderLineId,
                displayName: "Previous Order",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 9,
            },
        ],
    },
};

export default widgetModule;
