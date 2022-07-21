import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<boolean>;

export const DispatchSetIsWaitingForThreeDs: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetIsWaitingForThreeDs",
        isWaitingForThreeDs: props.parameter,
    });
};

export const chain = [DispatchSetIsWaitingForThreeDs];

const setIsWaitingForThreeDs = createHandlerChainRunner(chain, "SetIsWaitingForThreeDs");
export default setIsWaitingForThreeDs;
