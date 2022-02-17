import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import VmiDashboardState from "@insite/client-framework/Store/Pages/VmiDashboard/VmiDashboardState";
import { VmiBinCountModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: VmiDashboardState = {};

const reducer = {
    "Pages/VmiDashboard/CompleteLoadBelowMinimumCount": (
        draft: Draft<VmiDashboardState>,
        action: { result: VmiBinCountModel },
    ) => {
        draft.belowMinimumCount = action.result.count;
    },
    "Pages/VmiDashboard/CompleteLoadFastMovingCount": (
        draft: Draft<VmiDashboardState>,
        action: { result: VmiBinCountModel },
    ) => {
        draft.fastMovingCount = action.result.count;
    },
    "Pages/VmiDashboard/CompleteLoadSlowMovingCount": (
        draft: Draft<VmiDashboardState>,
        action: { result: VmiBinCountModel },
    ) => {
        draft.slowMovingCount = action.result.count;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
