import { ApiHandlerDiscreteParameter, createHandlerChainRunnerOptionalParameter, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { addLineCollection } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { CartLineCollectionModel, CartLineModel, OrderLineModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess, CartLineCollectionModel, CartLineCollectionModel>;

export const DispatchBeginReorder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/BeginReorder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const order = getOrderState(state, state.pages.orderDetails.orderNumber);
    if (!order.value) {
        throw new Error("Reorder was called but there was no order available");
    }

    props.apiParameter = {
        cartLines: order.value.orderLines!.map((line: OrderLineModel) => ({
            productId: line.productId,
            qtyOrdered: line.qtyOrdered,
            unitOfMeasure: line.unitOfMeasure,
        } as CartLineModel)),
    } as CartLineCollectionModel;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await addLineCollection({ cartId: API_URL_CURRENT_FRAGMENT, cartLineCollection: props.apiParameter });
};

export const DispatchCompleteReorder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/CompleteReorder",
        cartLineCollection: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const chain = [
    DispatchBeginReorder,
    PopulateApiParameter,
    SendDataToApi,
    DispatchCompleteReorder,
    ExecuteOnSuccessCallback,
    LoadCart,
];

const reorder = createHandlerChainRunnerOptionalParameter(chain, {}, "Reorder");
export default reorder;
