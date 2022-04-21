import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ requestedPickUpDate?: Date; requestedPickUpDateDisabled?: boolean }>;

export const DispatchSetRequestedPickUpDate: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetRequestedPickUpDate",
        requestedPickUpDate: props.parameter.requestedPickUpDate,
        requestedPickUpDateDisabled: props.parameter.requestedPickUpDateDisabled,
    });
};

export const chain = [DispatchSetRequestedPickUpDate];

const setRequestedPickUpDate = createHandlerChainRunner(chain, "SetRequestedPickUpDate");
export default setRequestedPickUpDate;
