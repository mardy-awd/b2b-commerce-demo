import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";
import VmiBinDetailsState from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsState";
import { Draft } from "immer";

const initialState: VmiBinDetailsState = {
    getVmiCountsParameter: {
        sort: "createdOn DESC",
    },
    getVmiCountsUserParameter: {
        getUniqueByUser: true,
        pageSize: 20,
    },
    getVmiOrdersParameter: {
        sort: "OrderDate DESC",
    },
    countsFilterOpen: false,
    ordersFilterOpen: false,
    selectedVmiItems: {},
    isExportingVmiCounts: false,
    isExportingVmiOrders: false,
};

export const enum TableTabKeys {
    PreviousCounts = "PreviousCounts",
    PreviousOrders = "PreviousOrders",
}

const reducer = {
    "Pages/VmiBinDetails/UpdateVmiCountSearchFields": (
        draft: Draft<VmiBinDetailsState>,
        action: { parameter: GetVmiCountsApiParameter },
    ) => {
        draft.getVmiCountsParameter = { ...draft.getVmiCountsParameter, ...action.parameter };
    },
    "Pages/VmiBinDetails/UpdateVmiCountsUserSearchFields": (
        draft: Draft<VmiBinDetailsState>,
        action: { parameter: GetVmiCountsApiParameter },
    ) => {
        draft.getVmiCountsUserParameter = { ...draft.getVmiCountsUserParameter, ...action.parameter };
    },
    "Pages/VmiBinDetails/UpdateVmiOrderSearchFields": (
        draft: Draft<VmiBinDetailsState>,
        action: { parameter: GetCartsApiParameter },
    ) => {
        draft.getVmiOrdersParameter = { ...draft.getVmiOrdersParameter, ...action.parameter };
    },
    "Pages/VmiBinDetails/ToggleCountsFilterOpen": (draft: Draft<VmiBinDetailsState>) => {
        draft.countsFilterOpen = !draft.countsFilterOpen;
    },
    "Pages/VmiBinDetails/ToggleOrdersFilterOpen": (draft: Draft<VmiBinDetailsState>) => {
        draft.ordersFilterOpen = !draft.ordersFilterOpen;
    },
    "Pages/VmiBinDetails/ToggleVmiItemCheck": (
        draft: Draft<VmiBinDetailsState>,
        action: { ids: string[]; tabKey: TableTabKeys },
    ) => {
        if (!draft.selectedVmiItems[action.tabKey]) {
            draft.selectedVmiItems[action.tabKey] = {};
        }
        const selectedVmiItems = draft.selectedVmiItems[action.tabKey]!;
        for (const id of action.ids) {
            if (selectedVmiItems[id]) {
                delete selectedVmiItems[id];
            } else {
                selectedVmiItems[id] = true;
            }
        }
    },
    "Pages/VmiBinDetails/ClearVmiItemChecks": (draft: Draft<VmiBinDetailsState>, action: { tabKey: TableTabKeys }) => {
        draft.selectedVmiItems[action.tabKey] = {};
    },
    "Pages/VmiBinDetails/BeginExportVmiCounts": (draft: Draft<VmiBinDetailsState>) => {
        draft.isExportingVmiCounts = true;
    },
    "Pages/VmiBinDetails/CompleteExportVmiCounts": (draft: Draft<VmiBinDetailsState>) => {
        draft.isExportingVmiCounts = false;
    },
    "Pages/VmiBinDetails/BeginExportVmiOrders": (draft: Draft<VmiBinDetailsState>) => {
        draft.isExportingVmiOrders = true;
    },
    "Pages/VmiBinDetails/CompleteExportVmiOrders": (draft: Draft<VmiBinDetailsState>) => {
        draft.isExportingVmiOrders = false;
    },
    "Pages/VmiBinDetails/ClearCountsParameter": (draft: Draft<VmiBinDetailsState>) => {
        draft.getVmiCountsParameter = {
            ...initialState.getVmiCountsParameter,
            pageSize: draft.getVmiCountsParameter.pageSize,
        };
    },
    "Pages/VmiBinDetails/ClearOrdersParameter": (draft: Draft<VmiBinDetailsState>) => {
        draft.getVmiOrdersParameter = {
            ...initialState.getVmiOrdersParameter,
            pageSize: draft.getVmiOrdersParameter.pageSize,
        };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
