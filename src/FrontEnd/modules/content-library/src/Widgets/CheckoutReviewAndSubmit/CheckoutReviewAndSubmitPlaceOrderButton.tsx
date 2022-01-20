/* eslint-disable spire/export-styles */
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import {
    getCartState,
    getCurrentCartState,
    hasProductsWithInvalidPrice,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import React, { FC } from "react";
import { connect } from "react-redux";

interface OwnProps {
    styles?: ButtonPresentationProps;
}

const mapStateToProps = (state: ApplicationState) => {
    const { cartId, isPlacingOrder, isCheckingOutWithPayPay } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const billToState = getBillToState(state, cartState.value?.billToId);
    const shipToState = getShipToState(state, cartState.value?.shipToId);
    return {
        isDisabled:
            cartState.isLoading ||
            billToState.isLoading ||
            !billToState.value ||
            shipToState.isLoading ||
            !shipToState.value ||
            !billToState.value.address1 ||
            !shipToState.value.address1 ||
            isPlacingOrder ||
            isCheckingOutWithPayPay ||
            hasProductsWithInvalidPrice(cartState.value) ||
            cartState.value?.hasInsufficientInventory === true,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const CheckoutReviewAndSubmitPlaceOrderButton: FC<Props> = ({ isDisabled, styles }) => {
    const handleClick = () => {
        document.getElementById("reviewAndSubmitPaymentForm-submit")?.click();
    };
    return (
        <Button
            type="submit"
            disabled={isDisabled}
            data-test-selector="checkoutReviewAndSubmit_placeOrder"
            {...styles}
            onClick={handleClick}
        >
            {translate("Place Order")}
        </Button>
    );
};

export default connect(mapStateToProps)(CheckoutReviewAndSubmitPlaceOrderButton);
