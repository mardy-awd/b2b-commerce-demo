import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import { CatalogPagesState } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesState";
import { Draft } from "immer";

const initialState: CatalogPagesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    idByPath: {},
};

const reducer = {
    "Data/CatalogPages/BeginLoadCatalogPage": (draft: Draft<CatalogPagesState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/CatalogPages/CompleteLoadCatalogPage": (
        draft: Draft<CatalogPagesState>,
        action: { model: CatalogPage; path?: string },
    ) => {
        const { model, path } = action;
        const lowerPath = path?.toLowerCase();
        const lowerCanonicalPath = model?.canonicalPath?.toLowerCase();

        if (lowerPath) {
            // should be using this when possible, as the canonical path is not guaranteed to be unuique
            // it may be shared if the product is assigned to multiple categories
            draft.idByPath[lowerPath] = lowerPath;
            delete draft.isLoading[lowerPath];
            draft.byId[lowerPath] = model;
        } else if (lowerCanonicalPath) {
            draft.idByPath[lowerCanonicalPath] = lowerCanonicalPath;
            delete draft.isLoading[lowerCanonicalPath];
            draft.byId[lowerCanonicalPath] = model;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
