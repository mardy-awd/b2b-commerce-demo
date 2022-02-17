import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleVmiCountCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ToggleVmiItemCheck",
        ids: props.parameter.ids,
        tabKey: TableTabKeys.PreviousCounts,
    });
};

export const chain = [DispatchToggleVmiCountCheck];

const selectVmiCounts = createHandlerChainRunner(chain, "SelectVmiCounts");
export default selectVmiCounts;
