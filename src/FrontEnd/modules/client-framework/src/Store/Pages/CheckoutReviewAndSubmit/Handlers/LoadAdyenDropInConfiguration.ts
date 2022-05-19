import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { Dispatch } from "react";

type HandlerType = Handler<
    {
        sessionId: string;
        sessionData: string;
        region: string;
        clientKey: string;
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

export const SetOnPaymentCompleted: HandlerType = props => {
    const handleValidPaymentResponse = (resultCode: string) => {
        props.parameter.placeAdyenOrder(resultCode);
    };

    const handleInvalidPaymentResponse = (errorMessage: string) => {
        props.parameter.setAdyenErrorMessage(errorMessage);
        props.parameter.resetAdyenSession();
    };

    const handleRedirectPaymentAction = (adyenPaymentResult: any) => {
        // Not implemented - should only be needed for nonstandard use cases
        // Exists here as an example of how to handle redirect cases.
    };

    props.adyenConfiguration.onPaymentCompleted = (result: any, component: any) => {
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
    SetOnPaymentCompleted,
    SetOnChange,
    SetPaymentMethodsConfig,
    ExecuteOnSuccessCallback,
];

const loadAdyenDropInConfig = createHandlerChainRunner(chain, "LoadAdyenDropInConfig");
export default loadAdyenDropInConfig;
