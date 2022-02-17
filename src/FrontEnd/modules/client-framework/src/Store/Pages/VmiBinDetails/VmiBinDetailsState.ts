import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";

export default interface VmiBinDetailsState {
    getVmiCountsParameter: GetVmiCountsApiParameter;
    getVmiCountsUserParameter: GetVmiCountsApiParameter;
    getVmiOrdersParameter: GetCartsApiParameter;
    countsFilterOpen: boolean;
    ordersFilterOpen: boolean;
    selectedVmiItems: SafeDictionary<SafeDictionary<boolean>>;
    isExportingVmiCounts: boolean;
    isExportingVmiOrders: boolean;
}
