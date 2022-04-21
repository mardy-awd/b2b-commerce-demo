import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ requestedDeliveryDate?: Date; requestedDeliveryDateDisabled?: boolean }>;

export const DispatchSetRequestedDeliveryDate: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetRequestedDeliveryDate",
        requestedDeliveryDate: props.parameter.requestedDeliveryDate,
        requestedDeliveryDateDisabled: props.parameter.requestedDeliveryDateDisabled,
    });
};

export const chain = [DispatchSetRequestedDeliveryDate];

const setRequestedDeliveryDate = createHandlerChainRunner(chain, "SetRequestedDeliveryDate");
export default setRequestedDeliveryDate;
