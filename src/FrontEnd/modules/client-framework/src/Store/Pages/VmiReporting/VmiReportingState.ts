import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";

export default interface VmiReportingState {
    getVmiBinsParameter: GetVmiBinsApiParameter;
    filtersOpen: boolean;
    selectedVmiBins: SafeDictionary<boolean>;
    isExportingVmiProducts: boolean;
}
