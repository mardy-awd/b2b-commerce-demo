import { usePaymetricFrame } from "@insite/client-framework/Common/Hooks/usePaymetricFrame";
import { useSquareFrame } from "@insite/client-framework/Common/Hooks/useSquareFrame";
import {
    IFrame,
    TokenEx as TokenExType,
    TokenExCvvOnlyIframeConfig,
    TokenExIframeStyles,
    TokenExPCIIframeConfig,
    useTokenExFrame,
} from "@insite/client-framework/Common/Hooks/useTokenExFrame";
import { newGuid } from "@insite/client-framework/Common/StringHelpers";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import validateCreditCard from "@insite/client-framework/Common/Utilities/validateCreditCard";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import {
    authenticate,
    getAdyenSessionData,
    getAuthenticationStatus,
    PaymentAuthenticationModel,
    postAdyenRefund,
    ThreeDsModel,
} from "@insite/client-framework/Services/PaymentService";
import { TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadAdyenSettings from "@insite/client-framework/Store/Context/Handlers/LoadAdyenSettings";
import loadPaymetricConfig from "@insite/client-framework/Store/Context/Handlers/LoadPaymetricConfig";
import loadTokenExConfig from "@insite/client-framework/Store/Context/Handlers/LoadTokenExConfig";
import signOut from "@insite/client-framework/Store/Context/Handlers/SignOut";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import resetCurrentCartId from "@insite/client-framework/Store/Data/Carts/Handlers/ResetCurrentCartId";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import checkoutWithPayPal from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/CheckoutWithPayPal";
import getPaymetricResponsePacket from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/GetPaymetricResponsePacket";
import loadAdyenDropInConfig from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/LoadAdyenDropInConfiguration";
import placeOrder from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/PlaceOrder";
import setCheckoutPaymentMethod from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetCheckoutPaymentMethod";
import setIsWaitingForThreeDs from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetIsWaitingForThreeDs";
import setPlaceOrderErrorMessage from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetPlaceOrderErrorMessage";
import validateAdyenPayment, {
    ValidatAdyenPaymenteResult,
    ValidateAdyenPaymentParameter,
} from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/ValidateAdyenPayment";
import preloadOrderConfirmationData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/PreloadOrderConfirmationData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AdyenDropIn from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/AdyenDropIn";
import CreditCardBillingAddressEntry, {
    CreditCardBillingAddressEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardBillingAddressEntry";
import CreditCardDetailsEntry, {
    CreditCardDetailsEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardDetailsEntry";
import ECheckDetailsEntry, {
    ECheckDetailsEntryStyles,
    Validatable,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/ECheckDetailsEntry";
import PaymentProfileBillingAddress from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PaymentProfileBillingAddress";
import PayPalButton, { PayPalButtonStyles } from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PayPalButton";
import SavedPaymentProfileEntry, {
    SavedPaymentProfileEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/SavedPaymentProfileEntry";
import {
    convertApiDataToTokenExCardType,
    convertPaymetricCardType,
    convertTokenExCardType,
} from "@insite/content-library/Widgets/SavedPayments/PaymentUtilities";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext, { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { generateTokenExFrameStyleConfig } from "@insite/mobius/TokenExFrame";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import qs from "qs";
import React, { useEffect, useRef, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css, ThemeProps, withTheme } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const {
        cartId,
        payPalRedirectUri,
        payPalCheckoutErrorMessage,
        placeOrderErrorMessage,
        requestedPickUpDateDisabled,
        requestedDeliveryDateDisabled,
    } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const settingsCollection = getSettingsCollection(state);
    return {
        cartState,
        billToState: getBillToState(state, cartState.value ? cartState.value.billToId : undefined),
        countries: getCurrentCountries(state),
        websiteSettings: settingsCollection.websiteSettings,
        cartSettings: settingsCollection.cartSettings,
        tokenExConfigs: state.context.tokenExConfigs,
        orderConfirmationPageLink: getPageLinkByPageType(state, "OrderConfirmationPage"),
        savedPaymentsPageLink: getPageLinkByPageType(state, "SavedPaymentsPage"),
        session: state.context.session,
        signInPageLink: getPageLinkByPageType(state, "SignInPage"),
        checkoutReviewAndSubmitPageLink: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage"),
        payPalRedirectUri,
        payPalCheckoutErrorMessage,
        location: getLocation(state),
        adyenSettings: state.context.adyenSettings,
        paymetricConfig: state.context.paymetricConfig,
        enableVat: settingsCollection.productSettings.enableVat,
        bypassCvvForSavedCards: settingsCollection.cartSettings.bypassCvvForSavedCards,
        placeOrderErrorMessage,
        requestedDeliveryDateDisabled,
        requestedPickUpDateDisabled,
    };
};

const mapDispatchToProps = {
    loadTokenExConfig,
    placeOrder,
    checkoutWithPayPal,
    preloadOrderConfirmationData,
    loadBillTo,
    loadPaymetricConfig,
    loadAdyenSettings,
    loadAdyenDropInConfig,
    getPaymetricResponsePacket,
    resetCurrentCartId,
    setCheckoutPaymentMethod,
    signOut,
    validateAdyenPayment: makeHandlerChainAwaitable<ValidateAdyenPaymentParameter, ValidatAdyenPaymenteResult>(
        validateAdyenPayment,
    ),
    setPlaceOrderErrorMessage,
    setIsWaitingForThreeDs,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    ThemeProps<BaseTheme> &
    HasHistory &
    HasToasterContext;

export interface CheckoutReviewAndSubmitPaymentDetailsStyles {
    form?: InjectableCss;
    fieldset?: InjectableCss;
    paymentDetailsHeading?: TypographyPresentationProps;
    paymentMethodPayPalText?: TypographyPresentationProps;
    paymentMethodAndPONumberContainer?: GridContainerProps;
    paymentMethodGridItem?: GridItemProps;
    paymentMethodSelect?: SelectPresentationProps;
    paymentProfileBillingAddress?: any;
    paymentProfileExpiredErrorWrapper?: InjectableCss;
    paymentProfileExpiredErrorText?: TypographyPresentationProps;
    paymentProfileEditCardLink?: LinkPresentationProps;
    vatNumberGridItem?: GridItemProps;
    vatNumberText?: TextFieldPresentationProps;
    poNumberGridItem?: GridItemProps;
    poNumberText?: TextFieldPresentationProps;
    emptyGridItem?: GridItemProps;
    adyenDropInGridItem?: GridItemProps;
    mainContainer?: GridContainerProps;
    savedPaymentProfile?: SavedPaymentProfileEntryStyles;
    creditCardDetailsGridItem?: GridItemProps;
    eCheckDetailsGridItem?: GridItemProps;
    creditCardDetails?: CreditCardDetailsEntryStyles;
    creditCardAddressGridItem?: GridItemProps;
    creditCardAddress?: CreditCardBillingAddressEntryStyles;
    payPalButton?: PayPalButtonStyles;
    eCheckDetailsEntryStyles?: ECheckDetailsEntryStyles;
    paypalCheckoutErrorWrapper?: InjectableCss;
    paypalCheckoutErrorText?: TypographyPresentationProps;
    loadingSpinner?: LoadingSpinnerProps;
    threeDsModal?: ModalPresentationProps;
    threeDsButtonsWrapper?: InjectableCss;
    threeDsCancelButton?: ButtonPresentationProps;
}

export const checkoutReviewAndSubmitPaymentDetailsStyles: CheckoutReviewAndSubmitPaymentDetailsStyles = {
    fieldset: {
        css: css`
            margin: 0;
            padding: 0;
            border: 0;
        `,
    },
    paymentDetailsHeading: { variant: "h5" },
    paymentMethodAndPONumberContainer: {
        gap: 10,
        css: css`
            margin-bottom: 1rem;
        `,
    },
    paymentMethodGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    paymentProfileExpiredErrorWrapper: {
        css: css`
            display: flex;
            width: 100%;
        `,
    },
    paymentProfileExpiredErrorText: { color: "danger" },
    paymentProfileEditCardLink: {
        css: css`
            margin-left: 1rem;
        `,
    },
    vatNumberGridItem: { width: 6 },
    poNumberGridItem: { width: 6 },
    emptyGridItem: { width: 6 },
    creditCardDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    eCheckDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    creditCardAddressGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    paypalCheckoutErrorWrapper: {
        css: css`
            display: flex;
            width: 100%;
            padding-top: 1em;
        `,
    },
    paypalCheckoutErrorText: { color: "danger" },
    loadingSpinner: {
        css: css`
            margin: auto;
        `,
    },
    adyenDropInGridItem: { width: 12 },
    threeDsButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        `,
    },
};

declare const TokenEx: TokenExType;
let tokenExIframe: IFrame | undefined;
let tokenExAccountNumberIframe: IFrame | undefined;
let tokenExFrameStyleConfig: TokenExIframeStyles;

let cancelCheckForThreeDsResult = false;

const isNonEmptyString = (value: string | undefined) => value !== undefined && value.trim() !== "";

const isMonthAndYearBeforeToday = (month: number, year: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return year < currentYear || (year === currentYear && month < currentMonth + 1);
};

const styles = checkoutReviewAndSubmitPaymentDetailsStyles;
const StyledForm = getStyledWrapper("form");
const StyledFieldSet = getStyledWrapper("fieldset");

const CheckoutReviewAndSubmitPaymentDetails = ({
    loadBillTo,
    cartState,
    billToState,
    countries,
    websiteSettings,
    cartSettings,
    tokenExConfigs,
    placeOrder,
    orderConfirmationPageLink,
    savedPaymentsPageLink,
    history,
    checkoutWithPayPal,
    payPalRedirectUri,
    preloadOrderConfirmationData,
    loadTokenExConfig,
    theme,
    session,
    checkoutReviewAndSubmitPageLink,
    location,
    toaster,
    paymetricConfig,
    loadPaymetricConfig,
    adyenSettings,
    loadAdyenSettings,
    loadAdyenDropInConfig,
    getPaymetricResponsePacket,
    resetCurrentCartId,
    enableVat,
    bypassCvvForSavedCards,
    setCheckoutPaymentMethod,
    signInPageLink,
    placeOrderErrorMessage,
    signOut,
    requestedDeliveryDateDisabled,
    requestedPickUpDateDisabled,
    validateAdyenPayment,
    setPlaceOrderErrorMessage,
    setIsWaitingForThreeDs,
}: Props) => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [poNumber, setPONumber] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [saveCard, setSaveCard] = useState(false);
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const [possibleCardType, setPossibleCardType] = useState("");
    const [expirationMonth, setExpirationMonth] = useState(1);
    const [expirationYear, setExpirationYear] = useState(new Date().getFullYear());
    const [securityCode, setSecurityCode] = useState("");
    const [useBillingAddress, setUseBillingAddress] = useState(true);
    const [address1, setAddress1] = useState("");
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [paymentMethodError, setPaymentMethodError] = useState("");
    const [poNumberError, setPONumberError] = useState("");
    const [cardHolderNameError, setCardHolderNameError] = useState("");
    const [cardNumberError, setCardNumberError] = useState("");
    const [cardTypeError, setCardTypeError] = useState("");
    const [securityCodeError, setSecurityCodeError] = useState("");
    const [expirationError, setExpirationError] = useState("");
    const [address1Error, setAddress1Error] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [cityError, setCityError] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");
    const [payPalError, setPayPalError] = useState("");

    const [showFormErrors, setShowFormErrors] = useState(false);
    const [isCardNumberTokenized, setIsCardNumberTokenized] = useState(false);
    const [isTokenExIframeLoaded, setIsTokenExIframeLoaded] = useState(false);
    const [isECheckTokenized, setIsECheckTokenized] = useState(false);
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");
    const [threeDsModalIsOpen, setThreeDsModalIsOpen] = useState(false);
    const [threeDsRedirectHtml, setThreeDsRedirectHtml] = useState("");

    // Used in deciding which form element to focus on in the case the form is submitted with errors
    const paymentMethodRef = useRef<HTMLSelectElement>(null);
    const poNumberRef = useRef<HTMLInputElement>(null);
    const cardHolderNameRef = useRef<HTMLInputElement>(null);
    const cardNumberRef = useRef<HTMLInputElement>(null);
    const cardTypeRef = useRef<HTMLSelectElement>(null);
    const securityCodeRef = useRef<HTMLInputElement>(null);
    const expirationMonthRef = useRef<HTMLSelectElement>(null);
    const expirationYearRef = useRef<HTMLSelectElement>(null);
    const address1Ref = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const stateRef = useRef<HTMLSelectElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);

    // Used in validation of form, since some form elements will not be validated when PayPal is active.
    const [isPayPal, setIsPayPal] = useState(false);
    // Help to work in the flow of React to validate the form.
    // Since setting isPayPal and validating will not have the correct "effect" in place to correctly validate the form.
    const [runSubmitPayPal, setRunSubmitPayPal] = useState(false);

    // will exist after we are redirected back here from paypal
    const {
        PayerID: payPalPayerId,
        token: payPalToken,
        redirectResult: adyenRedirectResult,
        cartId,
    } = parseQueryString<{
        PayerID?: string;
        token?: string;
        redirectResult?: string;
        cartId?: string;
    }>(location.search);

    const resetForm = () => {
        setCardHolderNameError("");
        setCardNumberError("");
        setCardTypeError("");
        setExpirationError("");
        setSecurityCodeError("");
        setAddress1("");
        setCountryError("");
        setStateError("");
        setCityError("");
        setPostalCodeError("");
        setPayPalError("");
        setIsCardNumberTokenized(false);
        setIsTokenExIframeLoaded(false);
    };

    useEffect(() => {
        if (!billToState.value && !billToState.isLoading && cartState.value && cartState.value.billToId) {
            loadBillTo({ billToId: cartState.value.billToId });
        }
    }, [billToState]);

    useTokenExFrame(websiteSettings);

    useEffect(() => resetForm(), [paymentMethod]);

    useEffect(() => {
        if (isCardNumberTokenized || isECheckTokenized) {
            submitCart();
        }
    }, [isCardNumberTokenized, isECheckTokenized]);

    const submitCart = (additionalData?: Partial<Parameters<typeof placeOrder>[0]>) => {
        if (!paymentGatewayRequiresAuthentication) {
            finishSubmittingCart(additionalData);
            return;
        }

        setIsWaitingForThreeDs(true);
        const threeDsPromise = new Promise<ThreeDsModel | undefined>((resolve, reject) => {
            const transactionId = newGuid();
            authenticate(
                transactionId,
                cardNumber || tokenName!,
                expirationMonth,
                expirationYear,
                cart!.orderGrandTotal,
                isPaymentProfile,
            ).then(
                ({ redirectHtml, threeDs }: PaymentAuthenticationModel) => {
                    if (redirectHtml) {
                        if (redirectHtml.includes("threedsFrictionLessRedirect")) {
                            resolve(threeDs);
                        } else {
                            setThreeDsModalIsOpen(true);
                            setThreeDsRedirectHtml(redirectHtml.replace("100vh", "60vh"));
                            checkForThreeDsResult(transactionId, resolve, reject);
                        }
                    } else {
                        resolve(undefined);
                    }
                },
                (error: any) => {
                    reject(error);
                },
            );
        });
        threeDsPromise.then(
            (threeDs: ThreeDsModel | undefined) => {
                finishSubmittingCart({ ...additionalData, threeDs });
                setIsWaitingForThreeDs(false);
            },
            (error: any) => {
                setPlaceOrderErrorMessage(error);
                setIsCardNumberTokenized(false);
                setIsWaitingForThreeDs(false);
            },
        );
    };

    const checkForThreeDsResult = (
        transactionId: string,
        resolve: (value: ThreeDsModel | undefined) => void,
        reject: (error: any) => void,
    ) => {
        try {
            const runScript = document.getElementById("authenticate-payer-script") as HTMLScriptElement;
            if (runScript) {
                // eslint-disable-next-line no-eval
                eval(runScript.text);
                runScript.remove();
            }
            // eslint-disable-next-line no-empty
        } catch {}

        getAuthenticationStatus(transactionId).then(
            ({ action, threeDs }: PaymentAuthenticationModel) => {
                if (action === "PENDING") {
                    setTimeout(() => {
                        if (cancelCheckForThreeDsResult) {
                            cancelCheckForThreeDsResult = false;
                            return;
                        }
                        checkForThreeDsResult(transactionId, resolve, reject);
                    }, 250);
                } else {
                    setThreeDsModalIsOpen(false);
                    if (action === "SUCCESS") {
                        resolve(threeDs);
                    } else {
                        reject({ errorMessage: "" });
                    }
                }
            },
            (error: any) => {
                setThreeDsModalIsOpen(false);
                reject(error);
            },
        );
    };

    const finishSubmittingCart = (additionalData?: Partial<Parameters<typeof placeOrder>[0]>) => {
        placeOrder({
            paymentMethod,
            poNumber: window.localStorage.getItem("order-po-number") ?? poNumber,
            vatNumber,
            saveCard,
            cardHolderName,
            cardNumber,
            cardType,
            expirationMonth,
            expirationYear,
            securityCode,
            useBillingAddress,
            address1,
            countryId,
            stateId,
            city,
            postalCode,
            payPalToken,
            payPalPayerId,
            accountHolderName,
            accountNumber,
            routingNumber,
            onSuccess: (cartId: string) => {
                preloadOrderConfirmationData({
                    cartId,
                    onSuccess: () => {
                        if (cart?.isAwaitingApproval) {
                            resetCurrentCartId({});
                            toaster.addToast({
                                body: siteMessage("OrderApproval_OrderPlaced"),
                                messageType: "success",
                            });
                        }
                        history.push(`${orderConfirmationPageLink!.url}?cartId=${cartId}`);
                    },
                });
            },
            onError: () => {
                setIsCardNumberTokenized(false);
                tokenExIframe?.reset();
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.cart) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult.cart.id);
                } else {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.();
                }
            },
            ...additionalData,
        });
    };

    useEffect(() => {
        if (!cartState.isLoading && cartState.value && cartState.value.paymentMethod && paymentMethod === "") {
            if (useAdyenDropIn && adyenRedirectResult) {
                // force set credit card payment method if we returned from Adyen
                setPaymentMethod(cartState.value.paymentOptions?.paymentMethods?.find(o => o.isCreditCard)?.name || "");
            } else {
                setPaymentMethod(cartState.value.paymentMethod.name);
            }
        }
    }, [cartState]);

    // IsPayPal
    // Setup isPayPal from cart.paymentOptions and validates form when cartState changes and is loaded.
    useEffect(() => {
        if (cartState.value) {
            const tempIsPayPal = cartState.value.paymentOptions?.isPayPal || (!!payPalToken && !!payPalPayerId);
            setIsPayPal(tempIsPayPal);
            if (tempIsPayPal) {
                validateForm();
            }
        }
    }, [cartState]);

    // Submit PayPal
    // When isPayPal and runSubmitPayPal are true will validate form, and submitPayPal with the current page redirectUri and current cart.
    useEffect(() => {
        if (isPayPal && runSubmitPayPal) {
            if (!validateForm()) {
                setShowFormErrors(true);
                return;
            }
            if (!checkoutReviewAndSubmitPageLink) {
                return;
            }
            let redirectUri = `${window.location.host}${checkoutReviewAndSubmitPageLink.url}`;
            if (cartId) {
                redirectUri += `?cartId=${cartId}`;
            }
            checkoutWithPayPal({ redirectUri });
        }
    }, [runSubmitPayPal, isPayPal]);

    // Submit PayPal State Check
    // Handles the PayPal button click response, getting the payPal redirectUri from the server on cart update call.
    useEffect(() => {
        if (payPalRedirectUri) {
            window.location.href = payPalRedirectUri;
        }
    }, [payPalRedirectUri]);

    const { value: cart } = cartState;

    const {
        useTokenExGateway,
        useECheckTokenExGateway,
        usePaymetricGateway,
        useSquareGateway,
        useAdyenDropIn,
        paymentGatewayRequiresAuthentication,
    } = websiteSettings;
    const [adyenSessionId, setAdyenSessionId] = useState("");
    const [adyenSessionData, setAdyenSessionData] = useState("");
    const [adyenWebOrderNumber, setAdyenWebOrderNumber] = useState("");
    const [adyenRegion, setAdyenRegion] = useState("");
    const [adyenErrorMessage, setAdyenErrorMessage] = useState("");
    const [adyenConfiguration, setAdyenConfiguration] = useState<any>(null);
    const [adyenDropIn, setAdyenDropIn] = useState<any>(null);
    const { showPayPal } = cartSettings;
    const paymentOptions = cart ? cart.paymentOptions : undefined;
    const paymentMethods = paymentOptions ? paymentOptions.paymentMethods : undefined;

    const paymentMethodDto = paymentMethods?.find(method => method.name === paymentMethod);
    const isCreditCard = paymentMethodDto?.isCreditCard === true;
    const isECheck = paymentMethodDto?.isECheck === true;
    const isPaymentProfile = paymentMethodDto?.isPaymentProfile === true;
    const isPaymentProfileExpired = paymentMethodDto?.isPaymentProfileExpired === true;
    const selectedCountry = countries?.find(country => country.id === countryId);
    let tokenName: string | undefined;
    const eCheckDetails = useRef<Validatable>(null);
    const tokenExReinitTimeout = 500;
    let lastTokenExReinitTime = 0;
    const tokenExErrorsLimit = (20 * 1e3) / tokenExReinitTimeout;
    let currentTokenExErrorCount = 0;

    if (useTokenExGateway) {
        if (isPaymentProfile) {
            tokenName = paymentMethodDto!.name;
        } else if (isCreditCard) {
            tokenName = "";
        }
    }

    if (useECheckTokenExGateway) {
        if (isECheck) {
            tokenName = "";
        }
    }

    const placeAdyenOrder = async (paymentResult: string) => {
        const { success, adyenPspReference, errorMessage, paymentAmount, currency } = await validateAdyenPayment({
            paymentResult,
        });
        if (!success) {
            if (adyenPspReference && paymentAmount && currency) {
                postAdyenRefund(adyenPspReference, adyenWebOrderNumber, paymentAmount, currency);
            }

            if (errorMessage) {
                setAdyenErrorMessage(errorMessage);
            }

            resetAdyenSession();
            return;
        }

        submitCart({
            isPending: true,
            isAdyenDropIn: true,
            adyenPspReference,
        });
    };

    const resetAdyenSession = () => {
        setAdyenSessionId("");
        setAdyenSessionData("");
        setAdyenRegion("");
        setAdyenConfiguration(null);

        const parsedQuery = parseQueryString<any>(window.location.search);
        delete parsedQuery.customerId;
        delete parsedQuery.amount;
        delete parsedQuery.sessionId;
        delete parsedQuery.redirectResult;
        delete parsedQuery.type;
        delete parsedQuery.resultCode;
        const queryString = qs.stringify(parsedQuery);
        history.replace(`${window.location.pathname}${queryString !== "" ? `?${queryString}` : ""}`);
    };

    useEffect(() => {
        let mounted = true;
        if (
            useAdyenDropIn &&
            paymentMethodDto?.isCreditCard &&
            checkoutReviewAndSubmitPageLink &&
            cartState.value?.orderGrandTotal &&
            !adyenSessionData
        ) {
            if (!adyenSettings?.clientKey) {
                loadAdyenSettings();
            }
            const returnUrl = !cartId
                ? checkoutReviewAndSubmitPageLink.url
                : checkoutReviewAndSubmitPageLink.url.includes("?")
                ? `${checkoutReviewAndSubmitPageLink.url}&cartId=${cartId}`
                : `${checkoutReviewAndSubmitPageLink.url}?cartId=${cartId}`;
            getAdyenSessionData(cartState.value.orderGrandTotal, returnUrl, cartId).then(result => {
                if (!mounted) {
                    return;
                }
                setAdyenSessionId(result.transactionId);
                setAdyenSessionData(result.sessionData);
                setAdyenWebOrderNumber(result.webOrderNumber);
                setAdyenRegion(result.region);
            });
        }
        return () => {
            mounted = false;
        };
    }, [useAdyenDropIn, checkoutReviewAndSubmitPageLink, cartState, paymentMethodDto, adyenSessionData]);

    useEffect(() => {
        if (adyenSessionId && adyenSessionData && adyenRegion && adyenSettings?.clientKey && !adyenConfiguration) {
            loadAdyenDropInConfig({
                sessionId: adyenSessionId,
                sessionData: adyenSessionData,
                region: adyenRegion,
                clientKey: adyenSettings.clientKey,
                cartId,
                webOrderNumber: adyenWebOrderNumber,
                returnUrl: !cartId
                    ? checkoutReviewAndSubmitPageLink!.url
                    : checkoutReviewAndSubmitPageLink!.url.includes("?")
                    ? `${checkoutReviewAndSubmitPageLink!.url}&cartId=${cartId}`
                    : `${checkoutReviewAndSubmitPageLink!.url}?cartId=${cartId}`,
                setAdyenErrorMessage,
                resetAdyenSession,
                placeAdyenOrder,
                onSuccess: (adyenConfiguration: any) => {
                    setAdyenConfiguration(adyenConfiguration);
                },
            });
        }
    }, [adyenSessionId, adyenSessionData, adyenRegion, adyenSettings]);

    useEffect(() => {
        setAdyenSessionId("");
        setAdyenSessionData("");
        setAdyenRegion("");
        setAdyenConfiguration(null);
    }, [cartState.value?.billToId]);

    useEffect(() => {
        if (typeof tokenName !== "undefined") {
            loadTokenExConfig({ token: tokenName, isECheck });
        }
    }, [paymentMethod]);

    const tokenExConfig = typeof tokenName !== "undefined" ? tokenExConfigs[tokenName] : undefined;

    useEffect(() => {
        if (typeof TokenEx === "undefined" || !tokenExConfig) {
            return;
        }

        setIsTokenExIframeLoaded(false);
        setUpTokenEx();
    }, [tokenExConfig, typeof TokenEx]);

    const setUpTokenEx = () => {
        if (!tokenExConfig || !paymentMethodDto || !cart?.showCreditCard || cart.requiresApproval) {
            return;
        }

        currentTokenExErrorCount = 0;
        if (isPaymentProfile && !isPaymentProfileExpired && !bypassCvvForSavedCards) {
            setUpTokenExIFrameCvvOnly(tokenExConfig);
        } else if (isCreditCard) {
            setUpTokenExIFrame(tokenExConfig);
        }
    };

    const setUpTokenExIFrame = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExPCIIframeConfig = {
            authenticationKey: config.authenticationKey,
            cvv: true,
            cvvContainerID: "tokenExSecurityCode",
            cvvInputType: "text",
            enablePrettyFormat: true,
            inputType: "text",
            origin: config.origin,
            pci: true,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            tokenExID: config.tokenExId,
            tokenScheme: config.tokenScheme,
            enableAriaRequired: true,
            title: translate("Credit card information"),
            customDataLabel: translate("credit card number"),
        };

        tokenExIframe = new TokenEx.Iframe("tokenExCardNumber", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("load", _ => setIsTokenExIframeLoaded(true));
        tokenExIframe.on("tokenize", data => {
            setCardNumber(data.token);
            setSecurityCode("CVV");
            setCardType(convertTokenExCardType(data.cardType));
            setIsCardNumberTokenized(true);
        });
        tokenExIframe.on("cardTypeChange", data => setPossibleCardType(data.possibleCardType));
        tokenExIframe.on("validate", data => {
            setShowFormErrors(true);
            if (data.isValid) {
                setCardNumberError("");
            } else {
                if (data.validator === "required") {
                    setCardNumberError(translate("Credit card number is required."));
                }
                if (data.validator === "format") {
                    setCardNumberError(translate("Credit card number is invalid."));
                }
            }

            if (data.isCvvValid) {
                setSecurityCodeError("");
            } else {
                if (data.cvvValidator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.cvvValidator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", data => {
            logger.error(data);
            if (
                Date.now() - lastTokenExReinitTime > tokenExReinitTimeout &&
                ++currentTokenExErrorCount <= tokenExErrorsLimit
            ) {
                lastTokenExReinitTime = Date.now();
                setTimeout(() => {
                    setUpTokenExIFrame(config);
                }, tokenExReinitTimeout);
            }
        });
    };

    const setUpTokenExIFrameCvvOnly = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExCvvOnlyIframeConfig = {
            authenticationKey: config.authenticationKey,
            cardType: convertApiDataToTokenExCardType(paymentMethodDto!.cardType),
            cvv: true,
            cvvOnly: true,
            inputType: "text",
            origin: config.origin,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            token: paymentMethodDto!.name,
            tokenExID: config.tokenExId,
            tokenScheme: paymentMethodDto!.tokenScheme,
            enableAriaRequired: true,
            title: translate("Security code"),
            customDataLabel: translate("Security code"),
        };

        tokenExIframe = new TokenEx.Iframe("ppTokenExSecurityCode", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("load", _ => setIsTokenExIframeLoaded(true));
        tokenExIframe.on("tokenize", _ => setIsCardNumberTokenized(true));
        tokenExIframe.on("validate", data => {
            if (data.isValid) {
                setSecurityCodeError("");
            } else {
                setShowFormErrors(true);
                if (data.validator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.validator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", data => {
            logger.error(data);
            if (
                Date.now() - lastTokenExReinitTime > tokenExReinitTimeout &&
                ++currentTokenExErrorCount <= tokenExErrorsLimit
            ) {
                lastTokenExReinitTime = Date.now();
                setTimeout(() => {
                    setUpTokenExIFrameCvvOnly(config);
                }, tokenExReinitTimeout);
            }
        });
    };

    const [paymetricFrameRef, paymetricIframe] = usePaymetricFrame(
        usePaymetricGateway,
        paymentMethod,
        isCreditCard,
        paymetricConfig,
        loadPaymetricConfig,
    );

    const [squareCard] = useSquareFrame(websiteSettings, paymentMethod, isCreditCard);

    const tokenizeSquareCard = () => {
        squareCard?.tokenize().then((tokenResult: any) => {
            if (tokenResult.status === "OK") {
                setCardType(tokenResult.details.card.brand);
                setExpirationMonth(tokenResult.details.card.expMonth);
                setExpirationYear(tokenResult.details.card.expYear);
                setCardNumber(tokenResult.token);
                setIsCardNumberTokenized(true);
            }
        });
    };

    const toasterContext = React.useContext(ToasterContext);
    useEffect(() => {
        if (placeOrderErrorMessage === siteMessage("CreditCardInfo_MaximumCreditCardAttempts")) {
            toasterContext.addToast({
                body: placeOrderErrorMessage,
                messageType: "danger",
            });

            setTimeout(() => {
                signOut();
                signInPageLink && history.push(signInPageLink.url);
            }, 3000);
        }
    }, [placeOrderErrorMessage]);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value !== "PayPal") {
            setIsPayPal(false);
        }
        setPaymentMethod(event.currentTarget.value);
        validatePaymentMethod(event.currentTarget.value);

        setCheckoutPaymentMethod({ paymentMethod: paymentMethods?.find(method => method.name === event.target.value) });
    };
    const handlePONumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPONumber(event.currentTarget.value);
        validatePONumber(event.currentTarget.value);
    };
    const handleVatNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVatNumber(event.currentTarget.value);
    };
    const handleSaveCardChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) => setSaveCard(value);
    const handleCardHolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardHolderName(event.currentTarget.value);
        validateCardHolderName(event.currentTarget.value);
    };
    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(event.currentTarget.value);
        validateCardNumber(event.currentTarget.value);
    };
    const handleCardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCardType(event.currentTarget.value);
        validateCardType(event.currentTarget.value);
    };
    const handleExpirationMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const month = Number(event.currentTarget.value);
        if (Number.isNaN(month)) {
            return;
        }
        setExpirationMonth(month);
        validateCardExpiration(month, expirationYear);
    };
    const handleExpirationYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(event.currentTarget.value);
        if (Number.isNaN(year)) {
            return;
        }
        setExpirationYear(year);
        validateCardExpiration(expirationMonth, year);
    };
    const handleSecurityCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.currentTarget.value);
        validateSecurityCode(event.currentTarget.value);
    };
    const handleUseBillingAddressChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) =>
        setUseBillingAddress(value);
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress1(event.currentTarget.value);
        validateAddress1(event.currentTarget.value);
    };
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryId(event.currentTarget.value);
        validateCountry(event.currentTarget.value);
    };
    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStateId(event.currentTarget.value);
        validateState(event.currentTarget.value);
    };
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.currentTarget.value);
        validateCity(event.currentTarget.value);
    };
    const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(event.currentTarget.value);
        validatePostalCode(event.currentTarget.value);
    };

    const handleEditCardClick = () => {
        if (!savedPaymentsPageLink) {
            return;
        }

        history.push(savedPaymentsPageLink.url);
    };

    const validatePaymentMethod = (paymentMethod: string) => {
        const paymentMethodValid =
            isPayPal || !paymentMethods || paymentMethods.length === 0 || isNonEmptyString(paymentMethod);
        setPaymentMethodError(!paymentMethodValid ? translate("Payment Method is required.") : "");
        return paymentMethodValid;
    };

    const validatePONumber = (poNumber: string) => {
        const poNumberValid = !cart || !cart.showPoNumber || !cart.requiresPoNumber || isNonEmptyString(poNumber);
        setPONumberError(!poNumberValid ? translate("PO Number is required.") : "");
        return poNumberValid;
    };

    const validateCardHolderName = (cardHolderName: string) => {
        const cardHolderNameValid = !isCreditCard || isNonEmptyString(cardHolderName);
        setCardHolderNameError(!cardHolderNameValid ? translate("Cardholder name is required.") : "");
        return cardHolderNameValid;
    };

    const validateCardNumber = (cardNumber: string) => {
        let cardNumberEmpty = false;
        let cardNumberValid = true;

        if (isCreditCard && !useTokenExGateway) {
            cardNumberEmpty = !isNonEmptyString(cardNumber);
            cardNumberValid = validateCreditCard(cardNumber);
        }

        if (cardNumberEmpty) {
            setCardNumberError(translate("Credit card number is required."));
        } else if (!cardNumberValid) {
            setCardNumberError(translate("Credit card number is invalid."));
        } else {
            setCardNumberError("");
        }

        return { cardNumberEmpty, cardNumberValid };
    };

    const validateCardType = (cardType: string) => {
        const cardTypeValid = !isCreditCard || useTokenExGateway || (!useTokenExGateway && isNonEmptyString(cardType));
        setCardTypeError(!cardTypeValid ? translate("Credit card type is required.") : "");
        return cardTypeValid;
    };

    const validateCardExpiration = (expirationMonth: number, expirationYear: number) => {
        const cardExpired = isCreditCard && isMonthAndYearBeforeToday(expirationMonth, expirationYear);
        setExpirationError(cardExpired ? translate("Card is expired. Please enter a valid expiration date.") : "");
        return cardExpired;
    };

    const validateSecurityCode = (securityCode: string) => {
        let securityCodeEmpty = false;
        let securityCodeValid = true;

        if (isCreditCard && !useTokenExGateway) {
            securityCodeEmpty = !isNonEmptyString(securityCode);
            securityCodeValid = /^\d+$/.test(securityCode);
        }

        if (securityCodeEmpty) {
            setSecurityCodeError(!securityCodeValid ? translate("Security code is required.") : "");
        } else if (!securityCodeValid) {
            setSecurityCodeError(translate("Security code is invalid."));
        } else {
            setSecurityCodeError("");
        }

        return { securityCodeEmpty, securityCodeValid };
    };

    const validateAddress1 = (address1: string) => {
        const address1Valid =
            !(isCreditCard || isECheck) || useBillingAddress || (!useBillingAddress && isNonEmptyString(address1));
        setAddress1Error(!address1Valid ? translate("Address is required.") : "");
        return address1Valid;
    };

    const validateCountry = (countryId: string) => {
        const countryValid =
            !(isCreditCard || isECheck) || useBillingAddress || (!useBillingAddress && isNonEmptyString(countryId));
        setCountryError(!countryValid ? translate("Country is required.") : "");
        return countryValid;
    };

    const validateState = (stateId: string) => {
        const stateValid =
            !(isCreditCard || isECheck) || useBillingAddress || (!useBillingAddress && isNonEmptyString(stateId));
        setStateError(!stateValid ? translate("State is required.") : "");
        return stateValid;
    };

    const validateCity = (city: string) => {
        const cityValid =
            !(isCreditCard || isECheck) || useBillingAddress || (!useBillingAddress && isNonEmptyString(city));
        setCityError(!cityValid ? translate("City is required.") : "");
        return cityValid;
    };

    const validatePostalCode = (postalCode: string) => {
        const postalCodeValid =
            !(isCreditCard || isECheck) || useBillingAddress || (!useBillingAddress && isNonEmptyString(postalCode));
        setPostalCodeError(!postalCodeValid ? translate("Postal Code is required.") : "");
        return postalCodeValid;
    };

    const handleAccountNumberIFrame = (accountNumberIFrame: IFrame) => {
        tokenExAccountNumberIframe = accountNumberIFrame;
    };

    const handlePaymetricValidateSuccess = (success: boolean) => {
        if (success) {
            paymetricIframe.submit({
                onSuccess: (msg: string) => {
                    // The HasPassed is case sensitive, and not standard json.
                    const message: { data: { HasPassed: boolean } } = JSON.parse(msg);
                    if (message.data.HasPassed) {
                        handleSuccessSubmitPaymetricIframe();
                    }
                },
                onError: (msg: string) => {
                    const message: { data: { Code: number } } = JSON.parse(msg);
                    // Code = 150 -> Already submitted
                    if (message.data.Code === 150) {
                        handleSuccessSubmitPaymetricIframe();
                    }
                },
            });
        }
    };

    const handleSuccessSubmitPaymetricIframe = () => {
        if (!paymetricConfig?.accessToken) {
            return;
        }

        getPaymetricResponsePacket({
            accessToken: paymetricConfig.accessToken,
            onComplete: result => {
                if (result.apiResult?.success) {
                    setCardType(convertPaymetricCardType(result.apiResult.creditCard.cardType));
                    setExpirationMonth(result.apiResult.creditCard.expirationMonth!);
                    setExpirationYear(result.apiResult.creditCard.expirationYear!);
                    setCardNumber(result.apiResult.creditCard.cardNumber!);
                    setSecurityCode(result.apiResult.creditCard.securityCode!);
                    setCardHolderName(result.apiResult.creditCard.cardHolderName!);
                    setIsCardNumberTokenized(true);
                }
            },
        });
    };

    const validateForm = () => {
        const paymentMethodValid = validatePaymentMethod(paymentMethod);
        const poNumberValid = validatePONumber(poNumber);
        if (isPayPal) {
            return paymentMethodValid;
        }

        if (useAdyenDropIn && paymentMethodDto?.isCreditCard) {
            return poNumberValid;
        }

        if (useTokenExGateway && ((isPaymentProfile && !bypassCvvForSavedCards) || isCreditCard)) {
            tokenExIframe?.validate();
        } else if (useECheckTokenExGateway && isECheck) {
            tokenExAccountNumberIframe?.validate();
        }

        if (usePaymetricGateway && cart && cart.showCreditCard && !cart.requiresApproval) {
            const isFormValidForPaymetricPayment = paymentMethodValid && poNumberValid;
            if (!isFormValidForPaymetricPayment) {
                return false;
            }
            if (isCreditCard && paymetricIframe) {
                paymetricIframe.validate({
                    onValidate: (success: boolean) => {
                        handlePaymetricValidateSuccess(success);
                    },
                });
            } else if (isPaymentProfile) {
                return true;
            }
        }

        if (useSquareGateway && cart && cart.showCreditCard && !cart.requiresApproval) {
            const isFormValidForSquarePayment = paymentMethodValid && poNumberValid;
            if (!isFormValidForSquarePayment) {
                return false;
            }
            if (isCreditCard && squareCard) {
                tokenizeSquareCard();
            } else if (isPaymentProfile) {
                return true;
            }
        }

        const cardHolderNameValid = validateCardHolderName(cardHolderName);
        const cardNumberResult = validateCardNumber(cardNumber);
        const cardTypeValid = validateCardType(cardType);
        const cardExpired = validateCardExpiration(expirationMonth, expirationYear);
        const securityCodeResult = validateSecurityCode(securityCode);
        const address1Valid = validateAddress1(address1);
        const countryValid = validateCountry(countryId);
        const stateValid = validateState(stateId);
        const cityValid = validateCity(city);
        const postalCodeValid = validatePostalCode(postalCode);
        let accountHolderNameValid = true;
        let accountNumberValid = true;
        let routingNumberValid = true;
        if (eCheckDetails?.current) {
            accountHolderNameValid = eCheckDetails.current.validateAccountHolderNameChange(accountHolderName);
            accountNumberValid = eCheckDetails.current.validateAccountNumberChange(accountNumber);
            routingNumberValid = eCheckDetails.current.validateRoutingNumberChange(routingNumber);
        }

        if (!paymentMethodValid) {
            paymentMethodRef.current?.focus();
        } else if (!poNumberValid) {
            poNumberRef.current?.focus();
        } else if (!cardHolderNameValid) {
            cardHolderNameRef.current?.focus();
        } else if (cardNumberResult.cardNumberEmpty || !cardNumberResult.cardNumberValid) {
            cardNumberRef.current?.focus();
        } else if (!cardTypeValid) {
            cardTypeRef.current?.focus();
        } else if (cardExpired) {
            const today = new Date();
            if (expirationYear < today.getFullYear()) {
                expirationYearRef.current?.focus();
            } else {
                expirationMonthRef.current?.focus();
            }
        } else if (securityCodeResult.securityCodeEmpty || !securityCodeResult.securityCodeValid) {
            securityCodeRef.current?.focus();
        } else if (!address1Valid) {
            address1Ref.current?.focus();
        } else if (!countryValid) {
            countryRef.current?.focus();
        } else if (!stateValid) {
            stateRef.current?.focus();
        } else if (!cityValid) {
            cityRef.current?.focus();
        } else if (!postalCodeValid) {
            postalCodeRef.current?.focus();
        }

        return (
            paymentMethodValid &&
            poNumberValid &&
            cardHolderNameValid &&
            !cardNumberResult.cardNumberEmpty &&
            cardNumberResult.cardNumberValid &&
            cardTypeValid &&
            !cardExpired &&
            !securityCodeResult.securityCodeEmpty &&
            securityCodeResult.securityCodeValid &&
            address1Valid &&
            countryValid &&
            stateValid &&
            cityValid &&
            postalCodeValid &&
            accountHolderNameValid &&
            accountNumberValid &&
            routingNumberValid &&
            !requestedDeliveryDateDisabled &&
            !requestedPickUpDateDisabled
        );
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (document.activeElement?.className === "adyen-checkout__payment-method__header__title") {
            // The adyen form buttons are incorrectly submitting our form, we should just ignore these occurances.
            return false;
        }

        if (!validateForm()) {
            setShowFormErrors(true);
            return false;
        }

        if (useAdyenDropIn && isCreditCard && !isPayPal) {
            if (adyenDropIn) {
                const { success, errorMessage } = await validateAdyenPayment({
                    customerId: cartState.value?.billToId,
                    paymentAmount: cartState.value?.orderGrandTotal,
                });
                if (success) {
                    window.localStorage.setItem("order-po-number", poNumber);
                    adyenDropIn.submit();
                } else if (errorMessage) {
                    setAdyenErrorMessage(errorMessage);
                }
            }
        } else if (useTokenExGateway && ((isPaymentProfile && !bypassCvvForSavedCards) || isCreditCard) && !isPayPal) {
            tokenExIframe?.tokenize();
        } else if (useECheckTokenExGateway && !isPayPal && isECheck) {
            tokenExAccountNumberIframe?.tokenize();
        } else {
            submitCart();
        }

        return false;
    };

    const submitPayPalRequest = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (!checkoutReviewAndSubmitPageLink) {
            return;
        }
        if (!session?.isAuthenticated) {
            return;
        }
        setPaymentMethod("");
        setRunSubmitPayPal(true);
        setIsPayPal(true);
    };

    const threeDsModalAfterOpenHandler = () => {
        setIsWaitingForThreeDs(false);
    };

    const cancelThreeDsModalButtonClickHandler = () => {
        setThreeDsModalIsOpen(false);
        cancelCheckForThreeDsResult = true;
        setIsCardNumberTokenized(false);
    };

    if (!tokenExFrameStyleConfig) {
        tokenExFrameStyleConfig = generateTokenExFrameStyleConfig({ theme });
    }

    if (!cart || cart.requiresApproval || !paymentOptions || !orderConfirmationPageLink) {
        return null;
    }

    const iframeName = useTokenExGateway
        ? "TokenEx"
        : usePaymetricGateway
        ? "Paymetric"
        : useSquareGateway
        ? "Square"
        : undefined;

    return (
        <StyledForm
            {...styles.form}
            id="reviewAndSubmitPaymentForm"
            onSubmit={handleFormSubmit}
            noValidate={true}
            data-test-selector="reviewAndSubmitPaymentForm"
        >
            {/* This button should only be used to trigger the submit of the form. Should be on the top of the form. */}
            <button id="reviewAndSubmitPaymentForm-submit" type="submit" style={{ display: "none" }}>
                {translate("Place Order")}
            </button>
            <StyledFieldSet {...styles.fieldset}>
                <Typography {...styles.paymentDetailsHeading} as="h2">
                    {translate("Payment Details")}
                </Typography>
                {isPayPal && (
                    <Typography {...styles.paymentMethodPayPalText} as="span">
                        {translate("Selected Payment Method: PayPal")}
                    </Typography>
                )}
                {!isPayPal && (
                    <GridContainer {...styles.paymentMethodAndPONumberContainer}>
                        <GridItem {...styles.paymentMethodGridItem}>
                            {paymentMethods && paymentMethods.length > 0 && (
                                <>
                                    <Select
                                        {...styles.paymentMethodSelect}
                                        label={translate("Payment Method")}
                                        value={paymentMethod ?? paymentMethodDto?.name}
                                        onChange={handlePaymentMethodChange}
                                        required
                                        error={showFormErrors && paymentMethodError}
                                        data-test-selector="checkoutReviewAndSubmit_paymentMethod"
                                        ref={paymentMethodRef}
                                    >
                                        <option value="">{translate("Select Payment Method")}</option>
                                        {paymentMethods.map(method => (
                                            <option key={method.name} value={method.name}>
                                                {method.description || method.name}
                                            </option>
                                        ))}
                                    </Select>
                                    {paymentMethodDto?.isPaymentProfile &&
                                        !paymentMethodDto.isPaymentProfileExpired && (
                                            <PaymentProfileBillingAddress
                                                address={paymentMethodDto.billingAddress}
                                                extendedStyles={styles.paymentProfileBillingAddress}
                                            />
                                        )}
                                    {paymentMethodDto?.isPaymentProfile && paymentMethodDto.isPaymentProfileExpired && (
                                        <StyledWrapper {...styles.paymentProfileExpiredErrorWrapper}>
                                            <Typography {...styles.paymentProfileExpiredErrorText}>
                                                {siteMessage("Checkout_PaymentProfileExpired")}
                                            </Typography>
                                            {savedPaymentsPageLink && (
                                                <Link
                                                    {...styles.paymentProfileEditCardLink}
                                                    onClick={handleEditCardClick}
                                                >
                                                    {translate("Edit Card")}
                                                </Link>
                                            )}
                                        </StyledWrapper>
                                    )}
                                </>
                            )}
                            {showPayPal && (
                                <PayPalButton
                                    {...styles.payPalButton}
                                    submitPayPalRequest={submitPayPalRequest}
                                    error={showFormErrors ? payPalError : undefined}
                                ></PayPalButton>
                            )}
                        </GridItem>
                        {enableVat && (
                            <GridItem {...styles.vatNumberGridItem}>
                                <TextField
                                    {...styles.vatNumberText}
                                    label={translate("VAT Number")}
                                    value={vatNumber}
                                    onChange={handleVatNumberChange}
                                    maxLength={50}
                                    data-test-selector="checkoutReviewAndSubmit_vatNumber"
                                />
                            </GridItem>
                        )}
                        {cart.showPoNumber && (
                            <GridItem {...styles.poNumberGridItem}>
                                <TextField
                                    {...styles.poNumberText}
                                    label={
                                        <>
                                            <span aria-hidden>{translate("PO Number")}</span>
                                            <VisuallyHidden>{translate("Purchase Order Number")}</VisuallyHidden>
                                        </>
                                    }
                                    value={poNumber}
                                    onChange={handlePONumberChange}
                                    required={cart.requiresPoNumber}
                                    maxLength={50}
                                    error={showFormErrors && poNumberError}
                                    data-test-selector="checkoutReviewAndSubmit_poNumber"
                                    ref={poNumberRef}
                                />
                            </GridItem>
                        )}
                        {cart.showPoNumber && enableVat && <GridItem {...styles.emptyGridItem}></GridItem>}
                        {paymentMethodDto?.isPaymentProfile &&
                            !paymentMethodDto.isPaymentProfileExpired &&
                            !bypassCvvForSavedCards && (
                                <GridItem width={6}>
                                    <SavedPaymentProfileEntry
                                        iframe={iframeName}
                                        isTokenExIframeLoaded={isTokenExIframeLoaded}
                                        securityCode={securityCode}
                                        onSecurityCodeChange={handleSecurityCodeChange}
                                        securityCodeError={showFormErrors ? securityCodeError : undefined}
                                        extendedStyles={styles.savedPaymentProfile}
                                    />
                                </GridItem>
                            )}
                        {paymentMethodDto?.isCreditCard && useAdyenDropIn && !adyenDropIn && !showPayPal && (
                            <LoadingSpinner {...styles.loadingSpinner} />
                        )}
                        {paymentMethodDto?.isCreditCard && useAdyenDropIn && (
                            <GridItem {...styles.adyenDropInGridItem}>
                                <AdyenDropIn
                                    redirectResult={adyenRedirectResult}
                                    adyenConfiguration={adyenConfiguration}
                                    setAdyenDropIn={setAdyenDropIn}
                                    adyenErrorMessage={adyenErrorMessage}
                                />
                            </GridItem>
                        )}
                        {cart.showCreditCard && paymentMethodDto?.isCreditCard && !useAdyenDropIn && (
                            <GridItem {...styles.creditCardDetailsGridItem}>
                                <CreditCardDetailsEntry
                                    canSaveCard={paymentOptions.canStorePaymentProfile}
                                    iframe={iframeName}
                                    paymetricFrameRef={paymetricFrameRef}
                                    isTokenExIframeLoaded={isTokenExIframeLoaded}
                                    saveCard={saveCard}
                                    onSaveCardChange={handleSaveCardChange}
                                    cardHolderName={cardHolderName}
                                    cardHolderNameRef={cardHolderNameRef}
                                    onCardHolderNameChange={handleCardHolderNameChange}
                                    cardHolderNameError={showFormErrors ? cardHolderNameError : undefined}
                                    cardNumber={cardNumber}
                                    cardNumberRef={cardNumberRef}
                                    onCardNumberChange={handleCardNumberChange}
                                    cardNumberError={showFormErrors ? cardNumberError : undefined}
                                    cardType={cardType}
                                    cardTypeRef={cardTypeRef}
                                    possibleCardType={possibleCardType}
                                    onCardTypeChange={handleCardTypeChange}
                                    cardTypeError={showFormErrors ? cardTypeError : undefined}
                                    expirationMonth={expirationMonth}
                                    expirationMonthRef={expirationMonthRef}
                                    onExpirationMonthChange={handleExpirationMonthChange}
                                    expirationYear={expirationYear}
                                    expirationYearRef={expirationYearRef}
                                    onExpirationYearChange={handleExpirationYearChange}
                                    expirationError={showFormErrors ? expirationError : undefined}
                                    securityCode={securityCode}
                                    securityCodeRef={securityCodeRef}
                                    onSecurityCodeChange={handleSecurityCodeChange}
                                    securityCodeError={showFormErrors ? securityCodeError : undefined}
                                    availableCardTypes={paymentOptions.cardTypes ?? []}
                                    availableMonths={paymentOptions.expirationMonths ?? []}
                                    availableYears={paymentOptions.expirationYears ?? []}
                                    extendedStyles={styles.creditCardDetails}
                                />
                            </GridItem>
                        )}
                        {cart.showECheck && paymentMethodDto?.isECheck && (
                            <GridItem {...styles.eCheckDetailsGridItem}>
                                <ECheckDetailsEntry
                                    iframe={useECheckTokenExGateway ? "TokenEx" : undefined}
                                    paymentMethod={paymentMethod}
                                    onAccountHolderNameChange={setAccountHolderName}
                                    onAccountNumberChange={setAccountNumber}
                                    onRoutingNumberChange={setRoutingNumber}
                                    tokenExConfig={tokenExConfig}
                                    tokenExFrameStyleConfig={tokenExFrameStyleConfig}
                                    extendedStyles={styles.eCheckDetailsEntryStyles}
                                    showFormErrors={showFormErrors}
                                    updateIsECheckTokenized={setIsECheckTokenized}
                                    updateShowFormErrors={setShowFormErrors}
                                    setAccountNumberIFrame={handleAccountNumberIFrame}
                                    ref={eCheckDetails}
                                />
                            </GridItem>
                        )}
                        {((cart.showECheck && paymentMethodDto?.isECheck) ||
                            (cart.showCreditCard && paymentMethodDto?.isCreditCard && !useAdyenDropIn)) && (
                            <GridItem {...styles.creditCardAddressGridItem}>
                                <CreditCardBillingAddressEntry
                                    useBillTo={useBillingAddress}
                                    onUseBillToChange={handleUseBillingAddressChange}
                                    billTo={billToState.value}
                                    address1={address1}
                                    address1Ref={address1Ref}
                                    onAddress1Change={handleAddressChange}
                                    address1Error={showFormErrors ? address1Error : undefined}
                                    country={countryId}
                                    countryRef={countryRef}
                                    onCountryChange={handleCountryChange}
                                    countryError={showFormErrors ? countryError : undefined}
                                    state={stateId}
                                    stateRef={stateRef}
                                    onStateChange={handleStateChange}
                                    stateError={showFormErrors ? stateError : undefined}
                                    city={city}
                                    cityRef={cityRef}
                                    onCityChange={handleCityChange}
                                    cityError={showFormErrors ? cityError : undefined}
                                    postalCode={postalCode}
                                    postalCodeRef={postalCodeRef}
                                    onPostalCodeChange={handlePostalCodeChange}
                                    postalCodeError={showFormErrors ? postalCodeError : undefined}
                                    availableCountries={countries ?? []}
                                    availableStates={selectedCountry?.states}
                                    extendedStyles={styles.creditCardAddress}
                                />
                            </GridItem>
                        )}
                    </GridContainer>
                )}
            </StyledFieldSet>
            <Modal
                {...styles.threeDsModal}
                headline={translate("Confirm Credit Card")}
                isOpen={threeDsModalIsOpen}
                isCloseable={false}
                onAfterOpen={threeDsModalAfterOpenHandler}
            >
                {/* eslint-disable react/no-danger */}
                <div id="redirect-html" dangerouslySetInnerHTML={{ __html: threeDsRedirectHtml }}></div>
                <StyledWrapper {...styles.threeDsButtonsWrapper}>
                    <Button {...styles.threeDsCancelButton} onClick={cancelThreeDsModalButtonClickHandler}>
                        {translate("Cancel")}
                    </Button>
                </StyledWrapper>
            </Modal>
        </StyledForm>
    );
};

const widgetModule: WidgetModule = {
    component: connect(
        mapStateToProps,
        mapDispatchToProps,
    )(withToaster(withHistory(withTheme(CheckoutReviewAndSubmitPaymentDetails)))),
    definition: {
        group: "Checkout - Review & Submit",
        displayName: "Payment Details",
        allowedContexts: ["CheckoutReviewAndSubmitPage"],
    },
};

export default widgetModule;
