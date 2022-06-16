import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getVmiCountsDataView } from "@insite/client-framework/Store/Data/VmiCounts/VmiCountsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateCountsSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    return {
        vmiCountsState: getVmiCountsDataView(state, state.pages.vmiBinDetails.getVmiCountsParameter),
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinDetailsCountsPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const vmiBinDetailsCountsPaginationStyles: VmiBinDetailsCountsPaginationStyles = {};

const styles = vmiBinDetailsCountsPaginationStyles;

const VmiBinDetailsCountsPagination = ({ vmiCountsState, updateSearchFields }: Props) => {
    if (!vmiCountsState.value || !vmiCountsState.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = vmiCountsState.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={totalItemCount}
            currentPage={page}
            resultsPerPage={pageSize}
            resultsPerPageOptions={pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}
            pageSizeCookie="VmiCounts-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsCountsPagination),
    definition: {
        group: "VMI Bin Details",
        displayName: "VMI Counts Pagination",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
