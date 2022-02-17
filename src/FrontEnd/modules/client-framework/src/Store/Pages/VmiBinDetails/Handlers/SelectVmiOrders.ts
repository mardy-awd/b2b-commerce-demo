import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleVmiOrderCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ToggleVmiItemCheck",
        ids: props.parameter.ids,
        tabKey: TableTabKeys.PreviousOrders,
    });
};

export const chain = [DispatchToggleVmiOrderCheck];

const selectVmiOrders = createHandlerChainRunner(chain, "SelectVmiOrders");
export default selectVmiOrders;
