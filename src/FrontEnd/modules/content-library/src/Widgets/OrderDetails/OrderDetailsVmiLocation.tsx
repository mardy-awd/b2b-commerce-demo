import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsVmiLocationStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    vmiLocation?: TypographyProps;
}

export const vmiLocationStyles: OrderDetailsVmiLocationStyles = {
    wrapper: {
        css: css`
            padding-bottom: 10px;
        `,
    },
    titleText: {
        variant: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
            font-size: 16px;
        `,
    },
};

const styles = vmiLocationStyles;

const OrderDetailsVmiLocation = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.vmiLocationName) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} id="orderDetailsVmiLocation">
                {translate("VMI Location")}
            </Typography>
            <Typography {...styles.vmiLocation} aria-labelledby="orderDetailsVmiLocation">
                {order.vmiLocationName}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsVmiLocation,
    definition: {
        allowedContexts: ["OrderDetailsPage", "VmiOrderDetailsPage"],
        group: "Order Details",
    },
};

export default widgetModule;
