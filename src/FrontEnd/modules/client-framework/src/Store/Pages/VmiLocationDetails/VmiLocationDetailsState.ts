import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";

export default interface VmiLocationDetailsState {
    getVmiBinsParameter: GetVmiBinsApiParameter;
    getVmiOrdersParameter: GetOrdersApiParameter;
    selectedVmiItems: SafeDictionary<SafeDictionary<boolean>>;
    isExportingVmiProducts: boolean;
    isExportingVmiOrders: boolean;
}
