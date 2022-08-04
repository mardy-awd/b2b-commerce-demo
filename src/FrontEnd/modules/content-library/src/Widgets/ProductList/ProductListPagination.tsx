import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    pagination: getProductListDataViewProperty(state, "pagination"),
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductListPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const paginationStyles: ProductListPaginationStyles = {};

const styles = paginationStyles;

const ProductListPagination = ({ addProductFilters, pagination }: Props) => {
    const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
    useEffect(() => {
        if (shouldScrollToTop) {
            window.scrollTo(0, 0);
            setShouldScrollToTop(false);
        }
    }, [pagination?.page]);

    const changePage = (newPageIndex: number) => {
        addProductFilters({ page: newPageIndex });
        setShouldScrollToTop(true);
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        addProductFilters({ pageSize: newPageSize });
    };

    if (!pagination || !pagination.totalItemCount) {
        return null;
    }

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={pagination.totalItemCount}
            currentPage={pagination.page}
            resultsPerPage={pagination.pageSize}
            resultsPerPageOptions={pagination.pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}
            pageSizeCookie="ProductList-PageSize"
            data-test-selector="productList_pagination"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPagination),
    definition: {
        group: "Product List",
        displayName: "Pagination",
        allowedContexts: ["ProductListPage"],
    },
};

export default widgetModule;
