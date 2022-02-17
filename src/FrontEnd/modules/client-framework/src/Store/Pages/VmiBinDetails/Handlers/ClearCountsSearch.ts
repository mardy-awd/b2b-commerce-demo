import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ClearSearch: Handler = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ClearCountsParameter",
    });
};

export const chain = [ClearSearch];

const clearCountsSearch = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearCountsSearch");
export default clearCountsSearch;
