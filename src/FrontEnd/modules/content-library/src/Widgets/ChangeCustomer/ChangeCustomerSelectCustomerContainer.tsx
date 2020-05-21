import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { GetBillTosApiParameter, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { Session } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import changeCustomerContext from "@insite/client-framework/Store/Context/Handlers/ChangeCustomerContext";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { BillToModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import ChangeCustomerBillToSelector, { ChangeCustomerBillToSelectorStyles } from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerBillToSelector";
import ChangeCustomerFulfillmentMethodSelector from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerFulfillmentMethodSelector";
import ChangeCustomerShipToSelector, { ChangeCustomerShipToSelectorStyles } from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerShipToSelector";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: ChangeCustomerSelectCustomerContainerStyles;
    billTosParameter: GetBillTosApiParameter,
    setBillTosParameter: (parameter: GetBillTosApiParameter) => void,
    shipTosParameter: GetShipTosApiParameter,
    setShipTosParameter: (parameter: GetShipTosApiParameter) => void,
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => ({
    cart: getCurrentCartState(state),
    shipTosDataView: getShipTosDataView(state, props.shipTosParameter),
    billTosDataView: getBillTosDataView(state, props.billTosParameter),
    fulfillmentMethod: state.context.session.fulfillmentMethod,
    session: state.context.session,
    pickUpWarehouse: state.context.session.pickUpWarehouse,
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
    customerSettings: getSettingsCollection(state).customerSettings,
    dashboardUrl: getPageLinkByPageType(state, "MyAccountPage")?.url,
    addressesUrl: getPageLinkByPageType(state, "AddressesPage")?.url,
    checkoutShippingUrl: getPageLinkByPageType(state, "CheckoutShippingPage")?.url,
    checkoutReviewAndSubmitUrl: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage")?.url,
    cartUrl: getPageLinkByPageType(state, "CartPage")?.url,
    returnUrl: getReturnUrl(state),
});

const mapDispatchToProps = {
    loadBillTos,
    loadShipTos,
    changeCustomerContext,
};

type Props = HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ChangeCustomerSelectCustomerContainerStyles {
    container?: GridContainerProps;
    billToSelectorGridItem?: GridItemProps;
    billToSelector?: ChangeCustomerBillToSelectorStyles;
    fulfillmentMethodSelectorGridItem?: GridItemProps;
    shipToSelectorGridItem?: GridItemProps;
    shipToSelector?: ChangeCustomerShipToSelectorStyles;
    useDefaultCustomerGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    continueButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
}

export const changeCustomerSelectCustomerContainerStyles: ChangeCustomerSelectCustomerContainerStyles = {
    billToSelectorGridItem: {
        width: 12,
    },
    fulfillmentMethodSelectorGridItem: {
        width: 12,
    },
    shipToSelectorGridItem: {
        width: 12,
    },
    useDefaultCustomerGridItem: {
        width: 12,
    },
    buttonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            margin-right: 15px;
        `,
    },
};

const ChangeCustomerSelectCustomerContainer: FC<Props> = ({
    extendedStyles,
    history,
    session,
    customerSettings,
    enableWarehousePickup,
    pickUpWarehouse,
    cart,
    shipTosDataView,
    billTosParameter,
    setBillTosParameter,
    shipTosParameter,
    setShipTosParameter,
    fulfillmentMethod,
    billTosDataView,
    loadBillTos,
    loadShipTos,
    changeCustomerContext,
    returnUrl,
    dashboardUrl,
    checkoutShippingUrl,
    cartUrl,
    checkoutReviewAndSubmitUrl,
 }) => {
    const [styles] = useState(() => mergeToNew(changeCustomerSelectCustomerContainerStyles, extendedStyles));
    const [billTo, setBillTo] = useState<BillToModel | undefined>(undefined);

    const [shipToSearchText, setShipToSearchText] = useState("");
    const [shipTo, setShipTo] = useState<ShipToModel | undefined>(undefined);

    const [noShipToAndCantCreate, setNoShipToAndCantCreate] = useState<boolean>(
        customerSettings.allowCreateNewShipToAddress
        && !shipToSearchText
        && shipTosDataView.value?.length === 0,
    );

    const billToSelectedHandler = (billTo: BillToModel) => {
        setBillTo(billTo);
        setShipTo(undefined);
        setShipTosParameter({
            ...shipTosParameter,
            billToId: billTo.id,
        });
    };

    const shipToSelectedHandler = (shipTo: ShipToModel) => {
        setShipTo(shipTo);
    };

    const handleContinueClicked = () => {
        if (!billTo || !shipTo || !cart.value) {
            return;
        }

        changeCustomerContext({
            billToId: billTo.id,
            shipToId: shipTo.id,
            fulfillmentMethod,
            pickUpWarehouse: fulfillmentMethod === "PickUp" ? pickUpWarehouse : null,
        });
        const returnUrl = getCustomerContinueReturnUrl({
            session,
            dashboardUrl,
            checkoutShippingUrl,
            canCheckOut: cart.value.canCheckOut,
            cartUrl,
            canBypassCheckoutAddress: cart.value.canBypassCheckoutAddress,
            checkoutReviewAndSubmitUrl,
        });
        history.push(returnUrl);
    };

    const handleCancelClicked = () => {
        window.location.href = returnUrl;
    };

    useEffect(
        () => {
            setNoShipToAndCantCreate(customerSettings.allowCreateNewShipToAddress
                && !shipToSearchText
                && shipTosDataView.value?.length === 0);
        },
        [customerSettings, shipToSearchText, shipTosDataView],
    );

    // Trigger Search for Bill Tos
    useEffect(
        () => {
            if (!billTosDataView.value && !billTosDataView.isLoading) {
                loadBillTos(billTosParameter);
            }
        },
        [billTosParameter],
    );

    // Trigger Search for Ship Tos
    useEffect(
        () => {
            if (billTo && !shipTosDataView.value && !shipTosDataView.isLoading) {
                loadShipTos(shipTosParameter);
            }
        },
        [shipTosParameter],
    );

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.billToSelectorGridItem}>
                <ChangeCustomerBillToSelector
                    extendedStyles={styles.billToSelector}
                    parameter={billTosParameter}
                    setParameter={setBillTosParameter}
                    noShipToAndCantCreate={noShipToAndCantCreate}
                    onSelect={billToSelectedHandler}
                    billTo={billTo} />
            </GridItem>
            <GridItem {...styles.fulfillmentMethodSelectorGridItem}>
                <ChangeCustomerFulfillmentMethodSelector />
            </GridItem>
            {billTo && <GridItem {...styles.shipToSelectorGridItem}>
                <ChangeCustomerShipToSelector
                    extendedStyles={styles.shipToSelector}
                    parameter={shipTosParameter}
                    setParameter={setShipTosParameter}
                    searchText={shipToSearchText}
                    setSearchText={setShipToSearchText}
                    enableWarehousePickup={enableWarehousePickup}
                    fulfillmentMethod={fulfillmentMethod}
                    onSelect={shipToSelectedHandler}
                    billToId={billTo?.id}
                    shipTo={shipTo} />
            </GridItem>}
            <GridItem {...styles.buttonsGridItem}>
                <Button {...styles.cancelButton} onClick={handleCancelClicked}>
                    {translate("Cancel")}
                </Button>
                <Button {...styles.continueButton} onClick={handleContinueClicked}
                    disabled={!billTo || !shipTo}
                    data-test-selector="changeCustomer_continue"
                >
                    {translate("Continue")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

type GetCustomerContinueReturnUrlType = (props: {
    session: Session;
    dashboardUrl?: string;
    checkoutShippingUrl?: string;
    canCheckOut: boolean;
    cartUrl?: string;
    canBypassCheckoutAddress: boolean;
    checkoutReviewAndSubmitUrl?: string;

}) => string;

type GetReturnUrlType = (state: ApplicationState) => string;

const getReturnUrl: GetReturnUrlType = (state: ApplicationState): string => {
    const { search } = getLocation(state);
    const query = parseQueryString<{ returnUrl?: string; returnurl?: string; }>(search);
    return query.returnUrl
        || query.returnurl
        || getPageLinkByPageType(state, "HomePage")?.url
        || "/";
};

export const getCustomerContinueReturnUrl: GetCustomerContinueReturnUrlType = ({
    session,
    dashboardUrl,
    checkoutShippingUrl,
    canCheckOut,
    cartUrl,
    canBypassCheckoutAddress,
    checkoutReviewAndSubmitUrl,
}) => {
    let returnUrl: string | undefined = "";
    if (session.dashboardIsHomepage) {
        returnUrl = dashboardUrl;
    } else if (session.customLandingPage) {
        returnUrl = session.customLandingPage;
    }

    if (returnUrl?.toLowerCase() === checkoutShippingUrl?.toLowerCase()) {
        if (!canCheckOut || session.isRestrictedProductExistInCart) {
            returnUrl = cartUrl;
        } else if (canBypassCheckoutAddress) {
            returnUrl = checkoutReviewAndSubmitUrl;
        }
    }

    // This forces the undefined typing to returnUrl or "/"
    returnUrl = returnUrl || "/";

    return returnUrl;
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(ChangeCustomerSelectCustomerContainer));
