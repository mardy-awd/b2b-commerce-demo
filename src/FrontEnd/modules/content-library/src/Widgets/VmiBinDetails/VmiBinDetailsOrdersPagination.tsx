import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import updateOrdersSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateOrdersSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    return {
        vmiOrdersState: getCartsDataView(state, state.pages.vmiBinDetails.getVmiOrdersParameter),
    };
};

const mapDispatchToProps = {
    updateOrdersSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinDetailsOrdersPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const vmiBinDetailsOrdersPaginationStyles: VmiBinDetailsOrdersPaginationStyles = {};

const styles = vmiBinDetailsOrdersPaginationStyles;

const VmiBinDetailsOrdersPagination = ({ vmiOrdersState, updateOrdersSearchFields }: Props) => {
    if (!vmiOrdersState.value || !vmiOrdersState.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = vmiOrdersState.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const changePage = (newPageIndex: number) => {
        updateOrdersSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateOrdersSearchFields({
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
            pageSizeCookie="VmiBinOrders-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsOrdersPagination),
    definition: {
        group: "VMI Bin Details",
        displayName: "Vmi Orders Pagination",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
