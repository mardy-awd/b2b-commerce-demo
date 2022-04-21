import isApiError from "@insite/client-framework/Common/isApiError";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    Cart,
    invalidAddressException,
    updateCart,
    UpdateCartApiParameter,
} from "@insite/client-framework/Services/CartService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { PaymentMethodDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ paymentMethod?: PaymentMethodDto }, UpdateCartApiParameter>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart and we are trying to set a payment method on it.");
    }

    const defaultPaymentMethod = {
        paymentMethod: {
            // need to set name to empty string when removing payment method
            name: "",
        } as PaymentMethodDto,
    };

    const updatedCart: Cart = {
        ...cart,
        ...(props.parameter.paymentMethod ? props.parameter : defaultPaymentMethod),
    };

    props.apiParameter = { cart: updatedCart };
};

export const UpdateCart: HandlerType = async props => {
    try {
        await updateCart(props.apiParameter);
    } catch (error) {
        if (isApiError(error) && error.status === 400 && error.errorJson.message === invalidAddressException) {
            return false;
        }
        throw error;
    }
};

export const LoadCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch(loadCart({ cartId }));
    } else {
        props.dispatch(loadCurrentCart({ getPromotions: true }));
    }
};

export const chain = [PopulateApiParameter, UpdateCart, LoadCart];

const setCheckoutPaymentMethod = createHandlerChainRunner(chain, "SetCheckoutPaymentMethod");
export default setCheckoutPaymentMethod;
