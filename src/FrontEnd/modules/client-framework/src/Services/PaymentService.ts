import { get, post } from "@insite/client-framework/Services/ApiService";

export interface PaymentAuthenticationModel {
    transactionId: string;
    webOrderNumber: string;
    redirectHtml: string;
    sessionData: string;
    action: string;
    region: string;
    cartId: string;
    threeDs: ThreeDsModel;
}

export interface ThreeDsModel {
    authenticationVersion: string;
    authenticationToken: string;
    dsTransactionId: string;
    acsEci: string;
}

export interface AdyenPaymentDetailsModel {
    pspReference: string;
    resultCode: string;
    amount: { currency: string; value: number | null } | null;
    merchantReference: string;
    paymentMethod: string;
}

export interface AdyenPaymentModel {
    pspReference: string;
    resultCode: string;
    amount: { currency: string; value: number | null } | null;
    merchantReference: string;
    action: any;
}

export interface AdyenRefundModel {
    merchantAccount: string;
    paymentPspReference: string;
    pspReference: string;
    reference: string;
    status: string;
    amount: { currency: string; value: number | null } | null;
}

const paymentAuthenticationUrl = "api/v1/paymentauthentication";

export function getAdyenSessionData(
    orderAmount: number | undefined,
    returnUrl: string | undefined,
    cartId: string | undefined,
) {
    const parameter = {
        operation: "initiate",
        orderAmount,
        returnUrl,
        cartId,
    };

    return post<any, PaymentAuthenticationModel>(paymentAuthenticationUrl, parameter);
}

export function getAdyenPaymentDetails(redirectResult: string) {
    const parameter = {
        details: {
            redirectResult,
        },
    };

    return post<any, AdyenPaymentDetailsModel>(`${paymentAuthenticationUrl}/adyenpaymentdetails`, parameter);
}

export function postAdyenPayment(
    webOrderNumber: string,
    orderAmount: number,
    currencyCode: string,
    returnUrl: string,
    data: any,
) {
    const parameter = {
        ...data,
        amount: {
            currency: currencyCode,
            value: convertToMinorUnits(orderAmount, currencyCode),
        },
        reference: webOrderNumber,
        returnUrl,
    };

    return post<any, AdyenPaymentModel>(`${paymentAuthenticationUrl}/adyenpayment`, parameter);
}

export function postAdyenRefund(
    pspReference: string,
    webOrderNumber: string,
    paymentAmountInMinorUnits: number,
    currencyCode: string,
) {
    const parameter = {
        pspReference,
        amount: {
            currency: currencyCode,
            value: paymentAmountInMinorUnits,
        },
        orderNumber: webOrderNumber,
    };

    return post<any, AdyenRefundModel>(`${paymentAuthenticationUrl}/adyenrefund`, parameter);
}

export function authenticate(
    transactionId: string,
    cardNumber: string,
    expirationMonth: number,
    expirationYear: number,
    orderAmount: number,
    isPaymentProfile = false,
) {
    const parameter = {
        operation: "authenticate",
        transactionId,
        cardNumber,
        expirationMonth,
        expirationYear,
        orderAmount,
        isPaymentProfile,
    };

    return post<any, PaymentAuthenticationModel>(paymentAuthenticationUrl, parameter);
}

export function getAuthenticationStatus(transactionId: string) {
    return get<PaymentAuthenticationModel>(`${paymentAuthenticationUrl}/${transactionId}`);
}

export function convertToMinorUnits(value: number, currencyCode: string) {
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
