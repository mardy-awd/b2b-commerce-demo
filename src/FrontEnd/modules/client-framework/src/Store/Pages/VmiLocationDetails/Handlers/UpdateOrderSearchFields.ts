import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";

type HandlerType = Handler<GetOrdersApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/UpdateOrderSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateOrderSearchFields = createHandlerChainRunner(chain, "UpdateOrderSearchFields");
export default updateOrderSearchFields;
