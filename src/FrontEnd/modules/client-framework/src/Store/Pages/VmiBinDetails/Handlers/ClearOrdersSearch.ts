import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ClearSearch: Handler = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ClearOrdersParameter",
    });
};

export const chain = [ClearSearch];

const clearOrdersSearch = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearOrdersSearch");
export default clearOrdersSearch;
