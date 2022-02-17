import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";

type HandlerType = Handler<GetCartsApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/UpdateVmiOrderSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateOrdersSearchFields = createHandlerChainRunner(chain, "UpdateOrdersSearchFields");
export default updateOrdersSearchFields;
