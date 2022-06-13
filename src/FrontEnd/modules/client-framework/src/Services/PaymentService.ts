import { post } from "@insite/client-framework/Services/ApiService";

export interface PaymentAuthenticationModel {
    transactionId: string;
    webOrderNumber: string;
    redirectHtml: string;
    sessionData: string;
    action: string;
    region: string;
    cartId: string;
}

export interface AdyenPaymentDetailsModel {
    pspReference: string;
    resultCode: string;
    amount: { currency: string; value: number | null } | null;
    merchantReference: string;
    paymentMethod: string;
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
