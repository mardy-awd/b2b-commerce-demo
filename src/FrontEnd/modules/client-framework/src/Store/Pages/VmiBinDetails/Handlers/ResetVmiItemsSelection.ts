import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";

type HandlerType = Handler<{
    tabKey: TableTabKeys;
}>;

export const DispatchClearVmiItemChecks: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ClearVmiItemChecks",
        tabKey: props.parameter.tabKey,
    });
};

export const chain = [DispatchClearVmiItemChecks];

const resetVmiItemsSelection = createHandlerChainRunner(chain, "ResetVmiItemsSelection");
export default resetVmiItemsSelection;
