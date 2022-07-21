import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{}, {}>;

export const DispatchResetDealers: HandlerType = props => {
    props.dispatch({
        type: "Data/Dealers/Reset",
    });
};

export const chain = [DispatchResetDealers];

const resetDealers = createHandlerChainRunnerOptionalParameter(chain, {}, "ResetDealers");

export default resetDealers;
