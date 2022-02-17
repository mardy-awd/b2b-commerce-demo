import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getVmiCountsDataView(state: ApplicationState, getVmiCountsParameter: GetVmiCountsApiParameter) {
    return getDataView(state.data.vmiCounts, getVmiCountsParameter);
}
