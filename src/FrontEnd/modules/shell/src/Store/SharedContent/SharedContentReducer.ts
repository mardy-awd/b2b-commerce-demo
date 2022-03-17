import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { SharedContentState } from "@insite/shell/Store/SharedContent/SharedContentState";
import { Draft } from "immer";

const initialState: SharedContentState = {
    searchQuery: "",
    showEditForm: false,
};

const reducer = {
    "SharedContent/UpdateSearchQuery": (draft: Draft<SharedContentState>, action: { searchQuery: string }) => {
        draft.searchQuery = action.searchQuery;
    },
    "SharedContent/OpenAddContent": (draft: Draft<SharedContentState>) => {
        draft.showEditForm = true;
    },
    "SharedContent/CancelAddContent": (draft: Draft<SharedContentState>) => {
        draft.showEditForm = false;
    },
    "SharedContent/OpenCopyContent": (draft: Draft<SharedContentState>, action: { copyContentId: string }) => {
        draft.showEditForm = true;
        draft.copyContentId = action.copyContentId;
    },
    "SharedContent/CancelCopyContent": (draft: Draft<SharedContentState>) => {
        draft.showEditForm = false;
        draft.copyContentId = undefined;
    },
    "SharedContent/OpenEditContent": (draft: Draft<SharedContentState>, action: { editContentId: string }) => {
        draft.showEditForm = true;
        draft.editContentId = action.editContentId;
    },
    "SharedContent/CancelEditContent": (draft: Draft<SharedContentState>) => {
        draft.showEditForm = false;
        draft.editContentId = undefined;
    },
    "SharedContent/SetFromPageId": (draft: Draft<SharedContentState>, action: { fromPageId?: string }) => {
        draft.fromPageId = action.fromPageId;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
