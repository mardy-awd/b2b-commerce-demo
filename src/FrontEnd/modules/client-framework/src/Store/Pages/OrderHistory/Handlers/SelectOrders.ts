import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleSelectedOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/ToggleSelectedOrders",
        ids: props.parameter.ids,
    });
};

export const chain = [DispatchToggleSelectedOrders];

const selectOrders = createHandlerChainRunner(chain, "SelectOrders");
export default selectOrders;
