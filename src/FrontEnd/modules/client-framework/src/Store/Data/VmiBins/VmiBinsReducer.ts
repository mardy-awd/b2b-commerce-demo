import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { VmiBinsState } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsState";
import { VmiBinCollectionModel, VmiBinModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: VmiBinsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
    isRemoving: false,
};

const reducer = {
    "Data/VmiBins/BeginLoadVmiBins": (draft: Draft<VmiBinsState>, action: { parameter: GetVmiBinsApiParameter }) => {
        draft.isRemoving = false;
        setDataViewLoading(draft, action.parameter);
    },

    "Data/VmiBins/CompleteLoadVmiBins": (
        draft: Draft<VmiBinsState>,
        action: { parameter: GetVmiBinsApiParameter; collection: VmiBinCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.vmiBins!);
    },

    "Data/VmiBins/BeginRemoveVmiBins": (draft: Draft<VmiBinsState>) => {
        draft.isRemoving = true;
    },

    "Data/VmiBins/Reset": () => {
        return initialState;
    },

    "Data/VmiBins/BeginLoadVmiBin": (draft: Draft<VmiBinsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/VmiBins/CompleteLoadVmiBin": (draft: Draft<VmiBinsState>, action: { model: VmiBinModel }) => {
        delete draft.isLoading[action.model.id];
        draft.byId[action.model.id] = action.model;
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.model.id];
        }
    },

    "Data/VmiBins/FailedToLoadVmiBin": (draft: Draft<VmiBinsState>, action: { id: string; status: number }) => {
        delete draft.isLoading[action.id];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.id] = action.status;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
