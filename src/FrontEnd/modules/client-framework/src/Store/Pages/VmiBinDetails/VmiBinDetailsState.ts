import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";

export default interface VmiBinDetailsState {
    getVmiCountsParameter: GetVmiCountsApiParameter;
    getVmiCountsUserParameter: GetVmiCountsApiParameter;
    getVmiOrdersParameter: GetOrdersApiParameter;
    countsFilterOpen: boolean;
    ordersFilterOpen: boolean;
    selectedVmiItems: SafeDictionary<SafeDictionary<boolean>>;
    isExportingVmiCounts: boolean;
    isExportingVmiOrders: boolean;
}
