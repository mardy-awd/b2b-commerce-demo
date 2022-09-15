import { PaymetricConfig } from "@insite/client-framework/Services/SettingsService";
import { useEffect, useRef } from "react";

declare function $XIFrame(options: any): any;
let paymetricIframe: any;

export const usePaymetricFrame = (
    usePaymetricGateway: boolean,
    paymentMethod: string,
    isCreditCard: boolean,
    paymetricConfig: PaymetricConfig | undefined,
    loadPaymetricConfig: () => void,
) => {
    const paymetricFrameRef = useRef<HTMLIFrameElement>(null);

    const setupPaymetricIframe = () => {
        if (!paymetricConfig) {
            return;
        }

        paymetricIframe = $XIFrame({
            iFrameId: "paymetricIframe",
            targetUrl: paymetricConfig?.message,
            autosizewidth: false,
            autosizeheight: true,
        });
        paymetricIframe.onload();
    };

    useEffect(() => {
        if (usePaymetricGateway && isCreditCard) {
            loadPaymetricConfig();
        }
    }, [usePaymetricGateway, paymentMethod]);

    useEffect(() => {
        if (paymetricConfig?.success && paymetricFrameRef.current) {
            const paymetricScript = document.createElement("script");
            paymetricScript.src = paymetricConfig.javaScriptUrl;
            paymetricScript.onload = () => {
                if (paymetricFrameRef.current) {
                    paymetricFrameRef.current.setAttribute("src", paymetricConfig.message);
                    paymetricFrameRef.current.addEventListener("load", setupPaymetricIframe);
                }
            };
            document.body.appendChild(paymetricScript);
        }

        return () => {
            paymetricFrameRef.current?.removeEventListener("load", setupPaymetricIframe);
        };
    }, [paymetricConfig, paymetricFrameRef]);

    return [paymetricFrameRef, paymetricIframe];
};
