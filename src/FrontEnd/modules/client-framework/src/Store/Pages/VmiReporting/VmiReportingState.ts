import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";

export default interface VmiReportingState {
    getVmiBinsParameter: GetVmiBinsApiParameter;
    filtersOpen: boolean;
}
