import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import BillingAndShippingInfo from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/BillingAndShippingInfo";
import PickUpLocation from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PickUpLocation";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import ManagedAccordionSection from "@insite/mobius/AccordionSection/ManagedAccordionSection";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    const { fulfillmentMethod, pickUpWarehouse } = state.context.session;

    return {
        cartId,
        cart,
        shipToState: getShipToState(state, cart?.shipToId),
        billToState: getBillToState(state, cart?.billToId),
        fulfillmentMethod,
        pickUpWarehouse,
        shippingPageNavLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
    };
};

const mapDispatchToProps = {
    loadShipTo,
    loadBillTo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps & HasHistory;

export interface CheckoutReviewAndSubmitShippingInfoStyles {
    accordion?: AccordionPresentationProps;
    shippingInfoAccordionSection?: AccordionSectionPresentationProps;
    warningSection?: InjectableCss;
    warningIcon?: IconPresentationProps;
    warningText?: TypographyPresentationProps;
}

export const shippingInfoStyles: CheckoutReviewAndSubmitShippingInfoStyles = {
    shippingInfoAccordionSection: {
        titleTypographyProps: { weight: 600 },
    },
    warningSection: {
        css: css`
            display: flex;
            align-items: center;
            border: 2px solid ${getColor("danger.main")};
            padding: 15px 10px;
            margin-bottom: 10px;
        `,
    },
    warningIcon: {
        src: "AlertCircle",
        color: "danger.main",
        css: css`
            margin-right: 10px;
        `,
    },
};

const StyledSection = getStyledWrapper("section");
const styles = shippingInfoStyles;

const CheckoutReviewAndSubmitShippingInfo = ({
    shippingPageNavLink,
    shipToState,
    billToState,
    loadShipTo,
    cart,
    fulfillmentMethod,
    pickUpWarehouse,
    history,
    loadBillTo,
    cartId,
}: Props) => {
    useEffect(() => {
        if (!shipToState.value && !shipToState.isLoading && cart && cart.billToId && cart.shipToId) {
            loadShipTo({ billToId: cart.billToId, shipToId: cart.shipToId });
        }
    }, [shipToState]);

    useEffect(() => {
        if (!billToState.value && !billToState.isLoading && cart && cart.billToId) {
            loadBillTo({ billToId: cart.billToId });
        }
    }, [billToState]);

    if (!cart || !shipToState.value || !billToState.value) {
        return null;
    }

    const goBackToShipping = () => {
        if (!shippingPageNavLink) {
            return;
        }

        const backUrl = cartId ? `${shippingPageNavLink.url}?cartId=${cartId}` : shippingPageNavLink.url;
        return history.push(backUrl);
    };

    const sectionTitle =
        fulfillmentMethod === FulfillmentMethod.Ship ? "Billing & Shipping Information" : "Pick Up Location";
    const { carrier, shipVia, requestedDeliveryDateDisplay, requestedPickupDateDisplay } = cart;
    const showWarning = !billToState.value.address1 || !shipToState.value.address1;

    return (
        <Accordion {...styles.accordion} headingLevel={2} data-test-selector="checkoutReviewAndSubmit_shippingInfo">
            <ManagedAccordionSection
                title={translate(sectionTitle)}
                initialExpanded={showWarning || undefined}
                {...styles.shippingInfoAccordionSection}
            >
                {showWarning && (
                    <StyledSection {...styles.warningSection}>
                        <Icon {...styles.warningIcon}></Icon>
                        <Typography {...styles.warningText}>
                            {siteMessage("ReviewAndPay_EnterBillingShippingInfo")}
                        </Typography>
                    </StyledSection>
                )}
                {fulfillmentMethod === FulfillmentMethod.Ship && (
                    <BillingAndShippingInfo
                        billTo={billToState.value}
                        shipTo={shipToState.value}
                        carrier={carrier!}
                        shipVia={shipVia!}
                        deliveryDate={requestedDeliveryDateDisplay}
                        onEditBillTo={goBackToShipping}
                        onEditShipTo={goBackToShipping}
                    />
                )}
                {fulfillmentMethod === FulfillmentMethod.PickUp && (
                    <PickUpLocation
                        location={pickUpWarehouse!}
                        billTo={billToState.value}
                        pickUpDate={requestedPickupDateDisplay}
                        onEditLocation={goBackToShipping}
                        onEditBillTo={goBackToShipping}
                    />
                )}
            </ManagedAccordionSection>
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitShippingInfo)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: ["CheckoutReviewAndSubmitPage"],
        displayName: "Shipping Info",
    },
};

export default widgetModule;
