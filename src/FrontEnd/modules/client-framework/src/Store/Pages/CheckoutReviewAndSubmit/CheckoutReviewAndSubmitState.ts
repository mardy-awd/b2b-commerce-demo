export default interface CheckoutReviewAndSubmitState {
    cartId?: string;
    isPlacingOrder: boolean;
    isApplyingPromotion: boolean;
    promotionSuccessMessage?: string;
    promotionErrorMessage?: string;
    isCheckingOutWithPayPay: boolean;
    payPalRedirectUri?: string;
    requestedDeliveryDate?: Date | null;
    requestedDeliveryDateDisabled?: boolean;
    requestedPickupDate?: Date | null;
    requestedPickUpDateDisabled?: boolean;
    placeOrderErrorMessage?: string;
    isPreloadingData: boolean;
    payPalCheckoutErrorMessage?: string;
}
