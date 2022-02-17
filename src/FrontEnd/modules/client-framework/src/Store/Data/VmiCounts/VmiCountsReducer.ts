import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { VmiCountsState } from "@insite/client-framework/Store/Data/VmiCounts/VmiCountsState";
import { VmiCountCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: VmiCountsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/VmiCounts/BeginLoadVmiCounts": (
        draft: Draft<VmiCountsState>,
        action: { parameter: GetVmiCountsApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/VmiCounts/CompleteLoadVmiCounts": (
        draft: Draft<VmiCountsState>,
        action: { parameter: GetVmiCountsApiParameter; collection: VmiCountCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.binCounts!);
    },

    "Data/VmiCounts/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
