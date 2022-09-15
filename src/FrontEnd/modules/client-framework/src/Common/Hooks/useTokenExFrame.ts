import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";
import { useEffect } from "react";

// TokenEx doesn't provide an npm package or type definitions for using the iframe solution.
// This is just enough types to avoid the build warnings and make using TokenEx a bit easier.
export type TokenExIframeStyles = {
    base?: string;
    focus?: string;
    error?: string;
    cvv?: TokenExIframeStyles;
};

export type TokenExIframeConfig = {
    tokenExID: string;
    tokenScheme: string;
    authenticationKey: string;
    timestamp: string;
    origin: string;
    styles?: TokenExIframeStyles;
    pci?: boolean;
    enableValidateOnBlur?: boolean;
    inputType?: "number" | "tel" | "text";
    debug?: boolean;
    cvv?: boolean;
    cvvOnly?: boolean;
    cvvContainerID?: string;
    cvvInputType?: "number" | "tel" | "text";
    enableAriaRequired?: boolean;
    customDataLabel?: string;
    title?: string;
};

export type TokenExPCIIframeConfig = TokenExIframeConfig & {
    pci: true;
    enablePrettyFormat?: boolean;
};

export type TokenExCvvOnlyIframeConfig = TokenExIframeConfig & {
    cvvOnly: true;
    token?: string;
    cardType?: string;
};

export type IFrame = {
    new (containerId: string, config: TokenExIframeConfig): IFrame;
    load: () => void;
    on: (
        eventName: "load" | "validate" | "tokenize" | "error" | "cardTypeChange",
        callback: (data: any) => void,
    ) => void;
    remove: () => void;
    validate: () => void;
    tokenize: () => void;
    reset: () => void;
};

export type TokenEx = {
    Iframe: IFrame;
};

export const useTokenExFrame = (websiteSettings: WebsiteSettingsModel) => {
    useEffect(() => {
        if (websiteSettings.useTokenExGateway || websiteSettings.useECheckTokenExGateway) {
            const script = document.createElement("script");
            script.src = websiteSettings.tokenExTestMode
                ? "https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js"
                : "https://htp.tokenex.com/Iframe/Iframe-v3.min.js";
            script.async = true;

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);
};
