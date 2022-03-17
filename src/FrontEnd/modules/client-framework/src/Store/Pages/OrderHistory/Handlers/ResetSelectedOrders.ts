import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const DispatchClearSelectedOrders: Handler = props => {
    props.dispatch({
        type: "Pages/OrderHistory/ClearSelectedOrders",
    });
};

export const chain = [DispatchClearSelectedOrders];

const resetSelectedOrders = createHandlerChainRunnerOptionalParameter(chain, {}, "ResetSelectedOrders");
export default resetSelectedOrders;
