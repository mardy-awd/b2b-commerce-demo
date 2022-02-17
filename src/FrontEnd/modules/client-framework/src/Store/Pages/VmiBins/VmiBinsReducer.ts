import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import VmiBinsState from "@insite/client-framework/Store/Pages/VmiBins/VmiBinsState";
import { Draft } from "immer";

const initialState: VmiBinsState = {
    getVmiBinsParameter: {
        expand: ["product"],
    },
    filtersOpen: false,
    selectedVmiBins: {},
    isExportingVmiProducts: false,
};

const reducer = {
    "Pages/VmiBins/UpdateSearchFields": (draft: Draft<VmiBinsState>, action: { parameter: GetVmiBinsApiParameter }) => {
        draft.getVmiBinsParameter = { ...draft.getVmiBinsParameter, ...action.parameter };
    },
    "Pages/VmiBins/ClearParameter": (draft: Draft<VmiBinsState>) => {
        draft.getVmiBinsParameter = {
            ...initialState.getVmiBinsParameter,
            pageSize: draft.getVmiBinsParameter.pageSize,
            vmiLocationId: draft.getVmiBinsParameter.vmiLocationId,
        };
    },
    "Pages/VmiBins/ToggleFiltersOpen": (draft: Draft<VmiBinsState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
    "Pages/VmiBins/ToggleBinCheck": (draft: Draft<VmiBinsState>, action: { ids: string[] }) => {
        for (const id of action.ids) {
            if (draft.selectedVmiBins[id]) {
                delete draft.selectedVmiBins[id];
            } else {
                draft.selectedVmiBins[id] = true;
            }
        }
    },
    "Pages/VmiBins/ClearVmiItemChecks": (draft: Draft<VmiBinsState>) => {
        draft.selectedVmiBins = {};
    },
    "Pages/VmiBins/BeginExportVmiProducts": (draft: Draft<VmiBinsState>) => {
        draft.isExportingVmiProducts = true;
    },
    "Pages/VmiBins/CompleteExportVmiProducts": (draft: Draft<VmiBinsState>) => {
        draft.isExportingVmiProducts = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
