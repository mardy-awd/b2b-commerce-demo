import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";

type HandlerType = Handler<GetOrdersApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/UpdateVmiOrderSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateOrdersSearchFields = createHandlerChainRunner(chain, "UpdateOrdersSearchFields");
export default updateOrdersSearchFields;
