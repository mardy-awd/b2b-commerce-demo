import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { QuotesState } from "@insite/client-framework/Store/Data/Quotes/QuotesState";
import { QuoteCollectionModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: QuotesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Quotes/BeginLoadQuotes": (draft: Draft<QuotesState>, action: { parameter: GetQuotesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Quotes/CompleteLoadQuotes": (draft: Draft<QuotesState>, action: { parameter: GetQuotesApiParameter, collection: QuoteCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.quotes!);
    },
    "Data/Quotes/BeginLoadQuote": (draft: Draft<QuotesState>, action: { quoteId: string }) => {
        draft.isLoading[action.quoteId] = true;
    },
    "Data/Quotes/CompleteLoadQuote": (draft: Draft<QuotesState>, action: { quote: QuoteModel }) => {
        delete draft.isLoading[action.quote.id];
        draft.byId[action.quote.id] = action.quote;
    },
    "Data/Quotes/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
