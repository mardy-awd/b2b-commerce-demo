import { VmiBinsDataViewContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinsPaginationPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const vmiBinsPaginationPaginationStyles: VmiBinsPaginationPaginationStyles = {};

const styles = vmiBinsPaginationPaginationStyles;

const VmiBinsPagination = ({ updateSearchFields }: Props) => {
    const vmiBinsDataView = useContext(VmiBinsDataViewContext);

    if (!vmiBinsDataView.value || !vmiBinsDataView.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = vmiBinsDataView.pagination;

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
            pageSizeCookie="VmiReporting-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(VmiBinsPagination),
    definition: {
        displayName: "Pagination",
        group: "VMI Reporting",
        allowedContexts: ["VmiReportingPage"],
    },
};

export default widgetModule;
