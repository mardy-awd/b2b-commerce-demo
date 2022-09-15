import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import OrderHistoryState from "@insite/client-framework/Store/Pages/OrderHistory/OrderHistoryState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: OrderHistoryState = {
    isReordering: {},
    getOrdersParameter: {
        customerSequence: "-1",
        sort: "orderDate DESC",
    },
    incompleteGetOrdersParameter: {},
    getVmiLocationsParameter: {
        page: 1,
        pageSize: 9999,
    },
    filtersOpen: false,
    isVmiOrderHistoryPage: false,
    isExportingOrders: false,
    selectedOrderIds: {},
};

const reducer = {
    "Pages/OrderHistory/UpdateSearchFields": (
        draft: Draft<OrderHistoryState>,
        action: { parameter: GetOrdersApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getOrdersParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getOrdersParameter = { ...initialState.getOrdersParameter, ...action.parameter };
            draft.incompleteGetOrdersParameter = {};
        } else {
            draft.getOrdersParameter = { ...draft.getOrdersParameter, ...action.parameter };

            const skipProperties: (keyof GetOrdersApiParameter)[] = ["orderTotalOperator", "orderTotal"];
            const skipPropertiesSet = new Set(skipProperties.map(o => o.toString()));
            for (const key in draft.getOrdersParameter) {
                const value = (<any>draft.getOrdersParameter)[key];

                if (skipPropertiesSet.has(key)) {
                    continue;
                }

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getOrdersParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getOrdersParameter.page &&
                    draft.getOrdersParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getOrdersParameter.page = 1;
                }
            }
        }
    },
    "Pages/OrderHistory/UpdateTemporarySearchFields": (
        draft: Draft<OrderHistoryState>,
        action: { parameter: GetOrdersApiParameter & UpdateSearchFieldsType },
    ) => {
        draft.incompleteGetOrdersParameter = { ...draft.incompleteGetOrdersParameter, ...action.parameter };
        if (
            draft.incompleteGetOrdersParameter.orderTotalOperator &&
            (draft.incompleteGetOrdersParameter.orderTotal || draft.incompleteGetOrdersParameter.orderTotal === 0)
        ) {
            draft.getOrdersParameter.orderTotalOperator = draft.incompleteGetOrdersParameter.orderTotalOperator;
            draft.getOrdersParameter.orderTotal = draft.incompleteGetOrdersParameter.orderTotal;
        } else {
            delete draft.getOrdersParameter.orderTotalOperator;
            delete draft.getOrdersParameter.orderTotal;
        }
    },
    "Pages/OrderHistory/ClearParameter": (draft: Draft<OrderHistoryState>) => {
        draft.getOrdersParameter = {
            ...initialState.getOrdersParameter,
            pageSize: draft.getOrdersParameter.pageSize,
            vmiOrdersOnly: draft.getOrdersParameter.vmiOrdersOnly,
        };
        draft.incompleteGetOrdersParameter = {};
    },
    "Pages/OrderHistory/BeginReorder": (draft: Draft<OrderHistoryState>, action: { orderNumber: string }) => {
        draft.isReordering[action.orderNumber] = true;
    },
    "Pages/OrderHistory/CompleteReorder": (draft: Draft<OrderHistoryState>, action: { orderNumber: string }) => {
        delete draft.isReordering[action.orderNumber];
    },
    "Pages/OrderHistory/ToggleFiltersOpen": (draft: Draft<OrderHistoryState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
    "Pages/OrderHistory/SetVmiOrderHistoryPage": (
        draft: Draft<OrderHistoryState>,
        action: { isVmiOrderHistoryPage: boolean },
    ) => {
        draft.isVmiOrderHistoryPage = action.isVmiOrderHistoryPage;
    },
    "Pages/OrderHistory/BeginExportOrders": (draft: Draft<OrderHistoryState>) => {
        draft.isExportingOrders = true;
    },
    "Pages/OrderHistory/CompleteExportOrders": (draft: Draft<OrderHistoryState>) => {
        draft.isExportingOrders = false;
    },
    "Pages/OrderHistory/ToggleSelectedOrders": (draft: Draft<OrderHistoryState>, action: { ids: string[] }) => {
        for (const id of action.ids) {
            if (draft.selectedOrderIds[id]) {
                delete draft.selectedOrderIds[id];
            } else {
                draft.selectedOrderIds[id] = true;
            }
        }
    },
    "Pages/OrderHistory/ClearSelectedOrders": (draft: Draft<OrderHistoryState>) => {
        draft.selectedOrderIds = {};
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
