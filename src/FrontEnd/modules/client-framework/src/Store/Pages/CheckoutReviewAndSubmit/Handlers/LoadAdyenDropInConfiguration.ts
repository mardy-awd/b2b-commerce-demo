import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { getAdyenPaymentDetails, postAdyenPayment } from "@insite/client-framework/Services/PaymentService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { Dispatch } from "react";

type HandlerType = Handler<
    {
        sessionId: string;
        sessionData: string;
        region: string;
        clientKey: string;
        cartId?: string;
        webOrderNumber: string;
        returnUrl: string;
        setAdyenFormValid: Dispatch<boolean>;
        setAdyenErrorMessage: Dispatch<string>;
        resetAdyenSession: Dispatch<void>;
        placeAdyenOrder: (paymentResult: string) => void;
    } & HasOnSuccess,
    {
        adyenConfiguration: any;
    }
>;

export const CreateAdyenConfiguration: HandlerType = props => {
    props.adyenConfiguration = {
        environment: props.parameter.region,
        clientKey: props.parameter.clientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        session: {
            id: props.parameter.sessionId,
            sessionData: props.parameter.sessionData,
        },
        showPayButton: false,
    };
};

/** @deprecated Not needed anymore */
export const SetOnPaymentCompleted: HandlerType = props => {};

export const SetOnSubmit: HandlerType = props => {
    const handleValidPaymentResponse = (resultCode: string) => {
        props.parameter.placeAdyenOrder(resultCode);
    };

    const handleInvalidPaymentResponse = (errorMessage: string) => {
        props.parameter.setAdyenErrorMessage(errorMessage);
        props.parameter.resetAdyenSession();
    };

    const handleRedirectPaymentAction = (adyenPaymentResult: any) => {
        if (adyenPaymentResult.action.method === "GET") {
            window.location.href = adyenPaymentResult.action.url;
        } else if (adyenPaymentResult.action.method === "POST") {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = adyenPaymentResult.action.url;

            for (const key in adyenPaymentResult.action.data) {
                const input = document.createElement("input");
                input.name = key;
                input.value = adyenPaymentResult.action.data[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    };

    const handlePaymentResponse = (result: any) => {
        if (result?.action) {
            if (result.action.type === "redirect") {
                handleRedirectPaymentAction(result);
            } else {
                handleInvalidPaymentResponse("Adyen_Error");
            }
        } else {
            switch (result?.resultCode) {
                case "Pending":
                case "Received":
                case "Authorised":
                    handleValidPaymentResponse(result.resultCode);
                    break;
                case "Refused":
                    handleInvalidPaymentResponse("Adyen_Refused");
                    break;
                case "Cancelled":
                    handleInvalidPaymentResponse("Adyen_Cancelled");
                    break;
                default:
                    handleInvalidPaymentResponse("Adyen_Error");
                    break;
            }
        }
    };

    props.adyenConfiguration.onSubmit = (state: any, component: any) => {
        const cartState = props.parameter.cartId
            ? getCartState(props.getState(), props.parameter.cartId)
            : getCurrentCartState(props.getState());
        postAdyenPayment(
            props.parameter.webOrderNumber,
            cartState.value!.orderGrandTotal,
            props.getState().context.session.currency!.currencyCode,
            props.parameter.returnUrl,
            state.data,
        ).then(result => {
            handlePaymentResponse(result);
        });
    };

    props.adyenConfiguration.onAdditionalDetails = (state: any, component: any) => {
        getAdyenPaymentDetails(state.details.redirectResult).then(result => {
            handlePaymentResponse(result);
        });
    };
};

export const SetOnChange: HandlerType = props => {
    props.adyenConfiguration.onChange = (data: any, component: any) => {
        if (data.isValid) {
            props.parameter.setAdyenFormValid(true);
        } else {
            props.parameter.setAdyenFormValid(false);
        }
    };
};

export const SetPaymentMethodsConfig: HandlerType = props => {
    // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
    props.adyenConfiguration.paymentMethodsConfiguration = {
        card: {
            hasHolderName: true,
            holderNameRequired: true,
            enableStoreDetails: false,
            hideCVC: false,
        },
        ideal: {
            showImage: false,
        },
    };
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.adyenConfiguration);
};

export const chain = [
    CreateAdyenConfiguration,
    SetOnSubmit,
    SetOnChange,
    SetPaymentMethodsConfig,
    ExecuteOnSuccessCallback,
];

const loadAdyenDropInConfig = createHandlerChainRunner(chain, "LoadAdyenDropInConfig");
export default loadAdyenDropInConfig;
