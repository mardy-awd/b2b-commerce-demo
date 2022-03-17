import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import * as React from "react";

export const orderNumberStyles: SearchTextFieldStyles = {};
const styles = orderNumberStyles;

const OrderHistorySearchFieldOrderNumber: React.FunctionComponent<WidgetProps> = () => {
    return (
        <SearchTextField
            styles={styles}
            parameterField="orderNumber"
            label="Order #"
            inputType="text"
            placeholder=""
            testSelector="orderHistory_filterOrderNumber"
        />
    );
};

const widgetModule: WidgetModule = {
    component: OrderHistorySearchFieldOrderNumber,
    definition: {
        group: "Order History",
        allowedContexts: ["OrderHistoryPage", "VmiOrderHistoryPage"],
        displayName: "Order Number",
    },
};

export default widgetModule;
