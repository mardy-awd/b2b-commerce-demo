import { Dictionary } from "@insite/client-framework/Common/Types";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";

export default interface OrderHistoryState {
    getOrdersParameter: GetOrdersApiParameter;
    isReordering: Dictionary<boolean>;
    filtersOpen: boolean;
}
