import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    HandlerWithResult,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { getAdyenPaymentDetails } from "@insite/client-framework/Services/PaymentService";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

export type ValidateAdyenPaymentParameter = {
    paymentResult?: string;
    customerId?: string;
    paymentAmount?: number;
} & HasOnSuccess<ValidatAdyenPaymenteResult>;

export interface ValidatAdyenPaymenteResult {
    success: boolean;
    adyenPspReference?: string;
    errorMessage?: string;
    paymentAmount?: number;
    currency?: string;
}

type HandlerType = HandlerWithResult<
    ValidateAdyenPaymentParameter,
    ValidatAdyenPaymenteResult,
    {
        customerId?: string;
        paymentAmount?: number;
        redirectResult?: string;
        adyenPspReference?: string;
    }
>;

export const ValidatePaymentResult: HandlerType = ({ parameter: { paymentResult, onSuccess } }) => {
    if (
        paymentResult &&
        paymentResult !== "Authorised" &&
        paymentResult !== "Pending" &&
        paymentResult !== "Received"
    ) {
        onSuccess?.({ success: false });
        return false;
    }
};

export const SetInitialValues: HandlerType = props => {
    props.customerId = props.parameter.customerId;

    if (props.parameter.paymentAmount) {
        const currencyCode = props.getState().context.session.currency!.currencyCode;
        props.paymentAmount = convertToMinorUnits(props.parameter.paymentAmount, currencyCode);
    }
};

export const ExtractDataFromQueryString: HandlerType = async props => {
    const parsedQuery = parseQueryString<any>(window.location.search);
    if (!parsedQuery.redirectResult) {
        return;
    }

    props.customerId = parsedQuery.customerId;
    props.redirectResult = parsedQuery.redirectResult;

    if (parsedQuery.amount) {
        props.paymentAmount = Number(parsedQuery.amount);
    }

    const paymentDetails = await getAdyenPaymentDetails(parsedQuery.redirectResult);
    if (paymentDetails.amount?.value) {
        props.paymentAmount = paymentDetails.amount.value;
    }
    props.adyenPspReference = paymentDetails.pspReference;
};

export const ReloadCart: HandlerType = async props => {
    // if we have paymentResult, then we have already paid and reloaded cart before payment
    if (props.parameter.paymentResult) {
        return;
    }

    // if we have redirectResult it means that we just loaded the page and the cart is fresh
    if (props.redirectResult) {
        return;
    }

    const { cartId } = props.getState().pages.checkoutReviewAndSubmit;
    if (cartId) {
        await executeAwaitableHandlerChain<Parameters<typeof loadCart>[0], void>(loadCart, { cartId }, props);
    } else {
        await executeAwaitableHandlerChain(loadCurrentCart, {}, props);
    }
};

export const ValidateCustomer: HandlerType = ({ customerId, paymentAmount, parameter: { onSuccess }, getState }) => {
    if (!customerId) {
        return;
    }

    const state = getState();
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    if (customerId !== cartState.value!.billToId) {
        onSuccess?.({
            success: false,
            errorMessage: siteMessage("Adyen_CustomerIsDifferent") as string,
            paymentAmount,
            currency: state.context.session.currency!.currencyCode,
        });
        return false;
    }
};

export const ValidateAmount: HandlerType = props => {
    const {
        paymentAmount,
        parameter: { onSuccess },
        getState,
    } = props;

    const state = getState();
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const currencyCode = props.getState().context.session.currency!.currencyCode;
    if (paymentAmount && paymentAmount !== convertToMinorUnits(cartState.value!.orderGrandTotal, currencyCode)) {
        onSuccess?.({
            success: false,
            errorMessage: siteMessage("Adyen_AmountIsDifferent") as string,
            adyenPspReference: props.adyenPspReference,
            paymentAmount,
            currency: props.getState().context.session.currency!.currencyCode,
        });
        return false;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.({
        success: true,
        adyenPspReference: props.adyenPspReference,
        paymentAmount: props.paymentAmount,
        currency: props.getState().context.session.currency!.currencyCode,
    });
};

export const chain = [
    ValidatePaymentResult,
    SetInitialValues,
    ExtractDataFromQueryString,
    ReloadCart,
    ValidateCustomer,
    ValidateAmount,
    ExecuteOnSuccessCallback,
];

const validateAdyenPayment = createHandlerChainRunner(chain, "ValidateAdyenPayment");
export default validateAdyenPayment;

function convertToMinorUnits(value: number, currencyCode: string) {
    let valueInMinorUnits: number;
    switch (currencyCode) {
        case "CVE":
        case "DJF":
        case "GNF":
        case "IDR":
        case "JPY":
        case "KMF":
        case "KRW":
        case "PYG":
        case "RWF":
        case "UGX":
        case "VND":
        case "VUV":
        case "XAF":
        case "XOF":
        case "XPF":
            valueInMinorUnits = value;
            break;
        case "BHD":
        case "IQD":
        case "JOD":
        case "KWD":
        case "LYD":
        case "OMR":
        case "TND":
            valueInMinorUnits = value * 1000;
            break;
        default:
            valueInMinorUnits = value * 100;
            break;
    }

    return Math.round(valueInMinorUnits);
}
