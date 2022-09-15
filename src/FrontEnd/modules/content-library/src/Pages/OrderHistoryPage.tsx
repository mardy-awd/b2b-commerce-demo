import { getCookie } from "@insite/client-framework/Common/Cookies";
import { convertDateToDateOnlyString } from "@insite/client-framework/Common/Utilities/DateUtilities";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadOrders from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrders";
import { getOrdersDataView, OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import loadOrderStatusMappings from "@insite/client-framework/Store/Data/OrderStatusMappings/Handlers/LoadOrderStatusMappings";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import setVmiOrderHistoryPage from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/SetVmiOrderHistoryPage";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import qs from "qs";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettingsCollection(state),
    ordersDataView: getOrdersDataView(state, state.pages.orderHistory.getOrdersParameter),
    getOrdersParameter: state.pages.orderHistory.getOrdersParameter,
    shouldLoadOrderStatusMappings: !getOrderStatusMappingDataView(state).value,
    location: getLocation(state),
});

const mapDispatchToProps = {
    loadOrders,
    loadOrderStatusMappings,
    updateSearchFields,
    setVmiOrderHistoryPage,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

const OrderHistoryPage = ({
    settings,
    loadOrders,
    loadOrderStatusMappings,
    updateSearchFields,
    setVmiOrderHistoryPage,
    ordersDataView,
    id,
    shouldLoadOrderStatusMappings,
    history,
    location,
    getOrdersParameter,
}: Props) => {
    let firstLoad = false;

    useEffect(() => {
        setVmiOrderHistoryPage(false);
        firstLoad = true;
        const pageSizeCookie = getCookie("OrderHistory-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (location.search && location.search.indexOf("SwitchingLanguage") === 0) {
            const getOrdersApiParameter = parseQueryString<GetOrdersApiParameter>(location.search);
            if (pageSize) {
                getOrdersApiParameter.pageSize = pageSize;
            }
            updateSearchFields({ ...getOrdersApiParameter, type: "Replace" });
        } else if (settings.orderSettings.lookBackDays > 0) {
            const fromDate = new Date(Date.now() - settings.orderSettings.lookBackDays * 60 * 60 * 24 * 1000);
            updateSearchFields({ fromDate: convertDateToDateOnlyString(fromDate), type: "Initialize", pageSize });
        } else {
            updateSearchFields({ type: "Initialize", pageSize });
        }

        if (shouldLoadOrderStatusMappings) {
            loadOrderStatusMappings();
        }
    }, []);

    useEffect(() => {
        if (!firstLoad) {
            const queryString = qs.stringify(getOrdersParameter);
            history.replace(`${location.pathname}${queryString !== "" ? `?${queryString}` : ""}`);
        }
    }, [getOrdersParameter]);

    useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!ordersDataView.value && !ordersDataView.isLoading) {
            loadOrders(getOrdersParameter);
        } else if (!ordersDataView.isLoading && ordersDataView.value?.length === 0 && getOrdersParameter.page) {
            updateSearchFields({ page: getOrdersParameter.page - 1 });
        }
    });

    return (
        <Page
            data-test-selector="orderHistory"
            css={css`
                position: relative;
            `}
        >
            <OrdersDataViewContext.Provider value={ordersDataView}>
                <Zone contentId={id} zoneName="Content" />
            </OrdersDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(OrderHistoryPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

/**
 * @deprecated Use string literal "OrderHistoryPage" instead of this constant.
 */
export const OrderHistoryPageContext = "OrderHistoryPage";
