import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";

export default interface OrderHistoryState {
    getOrdersParameter: GetOrdersApiParameter;
    getVmiLocationsParameter: GetVmiLocationsApiParameter;
    isReordering: SafeDictionary<true>;
    filtersOpen: boolean;
    isVmiOrderHistoryPage: boolean;
    isExportingOrders: boolean;
    selectedOrderIds: SafeDictionary<boolean>;
}
