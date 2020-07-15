import { getById } from "@insite/client-framework/Store/Data/DataState";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { Cart } from "@insite/client-framework/Services/CartService";

export function getCurrentCartState(state: ApplicationState) {
    return getCartState(state, API_URL_CURRENT_FRAGMENT);
}

export function getCartState(state: ApplicationState, cartId: string | undefined) {
    return getById(state.data.carts, cartId);
}

export function isOutOfStock(cartLine: CartLineModel) {
    return cartLine.availability!.messageType === 2 && !cartLine.canBackOrder;
}

const isPunchoutOrder = (cart: Cart) => !!cart.properties["isPunchout"];

export const isCartEmpty = (cart: Cart | undefined) => cart && !!cart.cartLines && cart.cartLines.length === 0;

export const canCheckoutWithCart = (cart: Cart | undefined) => cart
    && (cart.canCheckOut || hasRestrictedCartLines(cart))
    && !isPunchoutOrder(cart);

export const isCartCheckoutDisabled = (cart: Cart | undefined) => cart
    && (((!cart.canCheckOut && !isPunchoutOrder(cart) && !cart.canRequisition) || isCartEmpty(cart))
        || hasRestrictedCartLines(cart));

export const canSaveOrder = (cart: Cart | undefined) => cart && cart.canSaveOrder && !isCartEmpty(cart);

export const canAddAllToList = (cart: Cart | undefined) => !isCartEmpty(cart) && cart && !!cart.cartLines
    && cart.cartLines.every(line => line.canAddToWishlist);

export const hasRestrictedCartLines = (cart: Cart | undefined) => cart && !!cart.cartLines
    && cart.cartLines.filter(cartLine => cartLine.isRestricted).length > 0;

export const canPlaceOrder = (cart: Cart | undefined) => cart && !cart.requiresApproval
    && (!cart.paymentMethod || (cart.paymentMethod && !cart.paymentMethod.isPaymentProfileExpired));

export const canApplyPromotionsToCart = (cart: Cart | undefined) => cart && !cart.paymentOptions!.isPayPal && cart.type !== "Quote" && cart.type !== "Job";