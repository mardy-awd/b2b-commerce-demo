import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleBinCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiReporting/ToggleBinCheck",
        ids: props.parameter.ids,
    });
};

export const chain = [DispatchToggleBinCheck];

const selectVmiBins = createHandlerChainRunner(chain, "SelectVmiBins");
export default selectVmiBins;
