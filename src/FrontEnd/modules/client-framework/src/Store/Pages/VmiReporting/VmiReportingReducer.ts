import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import VmiReportingState from "@insite/client-framework/Store/Pages/VmiReporting/VmiReportingState";
import { Draft } from "immer";

const initialState: VmiReportingState = {
    getVmiBinsParameter: {
        expand: ["product"],
    },
    filtersOpen: false,
};

const reducer = {
    "Pages/VmiReporting/UpdateSearchFields": (
        draft: Draft<VmiReportingState>,
        action: { parameter: GetVmiBinsApiParameter },
    ) => {
        draft.getVmiBinsParameter = { ...draft.getVmiBinsParameter, ...action.parameter };
    },
    "Pages/VmiReporting/ClearParameter": (draft: Draft<VmiReportingState>) => {
        draft.getVmiBinsParameter = {
            ...initialState.getVmiBinsParameter,
            pageSize: draft.getVmiBinsParameter.pageSize,
            vmiLocationId: draft.getVmiBinsParameter.vmiLocationId,
        };
    },
    "Pages/VmiReporting/ToggleFiltersOpen": (draft: Draft<VmiReportingState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
