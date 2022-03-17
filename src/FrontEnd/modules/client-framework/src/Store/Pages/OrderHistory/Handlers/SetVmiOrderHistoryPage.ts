import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<boolean>;

export const SetVmiOrderHistoryPage: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/SetVmiOrderHistoryPage",
        isVmiOrderHistoryPage: props.parameter,
    });
};

export const chain = [SetVmiOrderHistoryPage];

const setVmiOrderHistoryPage = createHandlerChainRunner(chain, "SetVmiOrderHistoryPage");
export default setVmiOrderHistoryPage;
