import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";
import { useEffect, useState } from "react";

export type SquareCard = {
    attach: (selectorOrElement: string | HTMLElement) => Promise<void>;
    tokenize: () => Promise<any>;
};
export type SquarePayments = {
    card: () => Promise<SquareCard>;
};
export type Square = {
    payments: (applicationId: string, locationId: string) => SquarePayments;
};
declare const Square: Square;

export const useSquareFrame = (websiteSettings: WebsiteSettingsModel, paymentMethod: string, isCreditCard: boolean) => {
    const [isSquareScriptLoaded, setIsSquareScriptLoaded] = useState(false);
    const [squareCard, setSquareCard] = useState<SquareCard | undefined>();

    useEffect(() => {
        if (websiteSettings.useSquareGateway) {
            const script = document.createElement("script");
            script.src = websiteSettings.squareLive
                ? "https://web.squarecdn.com/v1/square.js"
                : "https://sandbox.web.squarecdn.com/v1/square.js";
            script.async = true;
            script.onload = () => {
                setIsSquareScriptLoaded(true);
            };

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    useEffect(() => {
        if (!isSquareScriptLoaded || typeof Square === "undefined" || !paymentMethod || !isCreditCard) {
            return;
        }

        setUpSquareIframe();
    }, [isSquareScriptLoaded, paymentMethod]);

    const setUpSquareIframe = (): void => {
        Square.payments(websiteSettings.squareApplicationId, websiteSettings.squareLocationId)
            .card()
            .then((card: SquareCard) => {
                setSquareCard(card);
                card.attach("#square-container");
            });
    };

    return [squareCard];
};
