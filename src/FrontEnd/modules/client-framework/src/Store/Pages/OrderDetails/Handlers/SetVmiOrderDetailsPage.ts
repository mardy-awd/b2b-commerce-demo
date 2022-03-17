import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<boolean>;

export const SetVmiOrderDetailsPage: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/SetVmiOrderDetailsPage",
        isVmiOrderDetailsPage: props.parameter,
    });
};

export const chain = [SetVmiOrderDetailsPage];

const setVmiOrderDetailsPage = createHandlerChainRunner(chain, "SetVmiOrderDetailsPage");
export default setVmiOrderDetailsPage;
