import { getCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadVmiCounts from "@insite/client-framework/Store/Data/VmiCounts/Handlers/LoadVmiCounts";
import { getVmiCountsDataView } from "@insite/client-framework/Store/Data/VmiCounts/VmiCountsSelectors";
import selectVmiCounts from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/SelectVmiCounts";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateCountsSearchFields";
import updateUserSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateUserSearchFields";
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
    const parsedQuery = parseQueryString<{ locationId?: string; id?: string }>(location.search);
    return {
        parameter: state.pages.vmiBinDetails.getVmiCountsParameter,
        vmiCountsState: getVmiCountsDataView(state, state.pages.vmiBinDetails.getVmiCountsParameter),
        selectedIds: state.pages.vmiBinDetails.selectedVmiItems[TableTabKeys.PreviousCounts] || {},
        parsedQuery,
    };
};

const mapDispatchToProps = {
    updateUserSearchFields,
    updateSearchFields,
    selectVmiCounts,
    loadVmiCounts,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface VmiBinDetailsCountsTableStyles {
    container?: InjectableCss;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;

    checkboxHeader?: DataTableHeaderProps;
    countHeader?: DataTableHeaderProps;
    createdOnDateHeader?: DataTableHeaderProps;
    createdByHeader?: DataTableHeaderProps;

    checkboxCells?: DataTableCellProps;
    countCells?: DataTableCellProps;
    createdOnDateCells?: DataTableCellProps;
    createdByCells?: DataTableCellProps;

    dataTable?: DataTableProps;
    vmiCountCheckbox?: CheckboxPresentationProps;
}

export const vmiBinDetailsCountsTableStyles: VmiBinDetailsCountsTableStyles = {
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

const styles = vmiBinDetailsCountsTableStyles;

const VmiBinDetailsCountsTable = ({
    parameter,
    vmiCountsState,
    selectedIds,
    parsedQuery,
    updateUserSearchFields,
    updateSearchFields,
    selectVmiCounts,
    loadVmiCounts,
}: Props) => {
    useEffect(() => {
        if (parameter.vmiLocationId !== parsedQuery.locationId || parameter.vmiBinId !== parsedQuery.id) {
            updateUserSearchFields({ vmiLocationId: parsedQuery.locationId, vmiBinId: parsedQuery.id });
            updateSearchFields({ vmiLocationId: parsedQuery.locationId, vmiBinId: parsedQuery.id });
            return;
        }

        const pageSizeCookie = getCookie("VmiCounts-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== parameter.pageSize) {
            updateSearchFields({ pageSize });
            return;
        }

        if (!vmiCountsState.value && !vmiCountsState.isLoading) {
            loadVmiCounts(parameter);
        }
    });

    const headerClick = (sortField: string) => {
        const sort = parameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateSearchFields({ sort, page: 1 });
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

    const vmiCountChangeHandler = (value: boolean, id?: string) => {
        if (id) {
            selectVmiCounts({ ids: [id] });
        } else {
            let ids = [];
            if (value) {
                if (!vmiCountsState.value) {
                    return;
                }
                for (const row of vmiCountsState.value) {
                    if (!selectedIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(selectedIds);
            }

            selectVmiCounts({ ids });
        }
    };

    if (vmiCountsState.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    if (!vmiCountsState.value) {
        return null;
    }

    if (vmiCountsState.value.length === 0) {
        if (parameter.page && parameter.page > 1) {
            updateSearchFields({ page: parameter.page - 1 });
            return null;
        }

        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography as="p" {...styles.noResultsText}>
                    {translate("No counts found")}
                </Typography>
            </StyledWrapper>
        );
    }

    const rows = vmiCountsState.value;

    return (
        <>
            <StyledWrapper {...styles.container}>
                <DataTable {...styles.dataTable}>
                    <DataTableHead>
                        <DataTableHeader {...styles.checkboxHeader}>
                            <Checkbox
                                {...styles.vmiCountCheckbox}
                                checked={Object.keys(selectedIds).length === rows.length}
                                onChange={(e, value) => vmiCountChangeHandler(value)}
                            />
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.countHeader}
                            sorted={sorted("count")}
                            onSortClick={() => headerClick("count")}
                        >
                            {translate("Count")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.createdOnDateHeader}
                            sorted={sorted("createdOn")}
                            onSortClick={() => headerClick("createdOn")}
                        >
                            {translate("Last Count Date")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.createdByHeader}
                            sorted={sorted("createdBy")}
                            onSortClick={() => headerClick("createdBy")}
                        >
                            {translate("User")}
                        </DataTableHeader>
                    </DataTableHead>
                    <DataTableBody>
                        {rows.map(({ id, count, createdOn, createdBy }) => (
                            <DataTableRow key={id}>
                                <DataTableCell {...styles.checkboxCells}>
                                    <Checkbox
                                        {...styles.vmiCountCheckbox}
                                        checked={selectedIds[id]}
                                        onChange={(e, value) => vmiCountChangeHandler(value, id)}
                                    />
                                </DataTableCell>
                                <DataTableCell {...styles.countCells}>{count}</DataTableCell>
                                <DataTableCell {...styles.createdOnDateCells}>
                                    <LocalizedDateTime dateTime={createdOn} />
                                </DataTableCell>
                                <DataTableCell {...styles.createdByCells}>{createdBy}</DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(VmiBinDetailsCountsTable))),
    definition: {
        group: "VMI Bin Details",
        displayName: "Search Counts Result Table",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
