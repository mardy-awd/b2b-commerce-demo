import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ additionalEmails: string }>;

export const DispatchSetAdditionalEmails: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetAdditionalEmails",
        additionalEmails: props.parameter.additionalEmails,
    });
};

export const chain = [DispatchSetAdditionalEmails];

const setAdditionalEmails = createHandlerChainRunner(chain, "SetAdditionalEmails");
export default setAdditionalEmails;
