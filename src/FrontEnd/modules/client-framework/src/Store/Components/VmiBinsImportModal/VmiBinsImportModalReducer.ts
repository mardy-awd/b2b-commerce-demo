import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProcessFileResult } from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/ProcessFile";
import VmiBinsImportModalState from "@insite/client-framework/Store/Components/VmiBinsImportModal/VmiBinsImportModalState";
import { Draft } from "immer";

const initialState: VmiBinsImportModalState = {
    parsedItems: [],
    isBadFile: false,
    isUploading: false,
    uploadLimitExceeded: false,
    modalIsOpen: false,
};

const reducer = {
    "Components/VmiBinsImportModal/BeginProcessFile": (draft: Draft<VmiBinsImportModalState>) => {},
    "Components/VmiBinsImportModal/CompleteProcessFile": (
        draft: Draft<VmiBinsImportModalState>,
        action: { result: ProcessFileResult },
    ) => {
        draft.parsedItems = action.result.parsedItems;
        draft.uploadLimitExceeded = action.result.uploadLimitExceeded;
        draft.isBadFile = action.result.isBadFile;
        draft.isUploading = action.result.isUploading;
    },
    "Components/VmiBinsImportModal/SetIsBadFile": (
        draft: Draft<VmiBinsImportModalState>,
        action: { parameter: { isBadFile: boolean } },
    ) => {
        draft.isBadFile = action.parameter.isBadFile;
    },
    "Components/VmiBinsImportModal/SetIsUploading": (
        draft: Draft<VmiBinsImportModalState>,
        action: { parameter: { isUploading: boolean } },
    ) => {
        draft.isUploading = action.parameter.isUploading;
    },
    "Components/VmiBinsImportModal/SetUploadLimitExceeded": (
        draft: Draft<VmiBinsImportModalState>,
        action: { parameter: { uploadLimitExceeded: boolean } },
    ) => {
        draft.uploadLimitExceeded = action.parameter.uploadLimitExceeded;
    },
    "Components/VmiBinsImportModal/SetModalIsOpen": (
        draft: Draft<VmiBinsImportModalState>,
        action: { isOpen: boolean },
    ) => {
        draft.modalIsOpen = action.isOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
