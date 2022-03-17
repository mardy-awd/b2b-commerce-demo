/* eslint-disable spire/export-styles */
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import React from "react";

interface OwnProps {
    title: string;
    orderNumber: string;
    isVmiOrderDetailsPage?: boolean;
    isVmiOrder?: boolean;
}

type Props = OwnProps;

const OrderDetailPageTypeLink: React.FunctionComponent<Props> = ({
    title,
    orderNumber,
    isVmiOrderDetailsPage,
    isVmiOrder,
}) => {
    return createWidgetElement("Basic/PageTypeLink", {
        fields: {
            pageType: isVmiOrderDetailsPage ? "VmiOrderDetailsPage" : "OrderDetailsPage",
            overrideTitle: title,
            queryString: isVmiOrderDetailsPage
                ? `orderNumber=${orderNumber}`
                : isVmiOrder
                ? `orderNumber=${orderNumber}&isVmiOrder=true`
                : `orderNumber=${orderNumber}`,
        },
    });
};

export default OrderDetailPageTypeLink;
