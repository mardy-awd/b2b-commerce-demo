import { ApiParameter, get, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { VmiCountCollectionModel } from "@insite/client-framework/Types/ApiModels";

const vmiBinCountsUrl = "/api/v1/vmiLocations/{vmiLocationId}/bins/{vmiBinId}/binCounts";

export interface GetVmiCountsApiParameter extends ApiParameter, HasPagingParameters {
    vmiLocationId?: string;
    vmiBinId?: string;
    userName?: string;
    previousCountFromDate?: string;
    previousCountToDate?: string;
    getUniqueByUser?: boolean;
    sort?: string;
}

export async function getVmiCounts(parameter: GetVmiCountsApiParameter) {
    if (!parameter.vmiLocationId) {
        throw Error("vmiLocationId is required");
    }

    if (!parameter.vmiBinId) {
        throw Error("vmiBinId is required");
    }

    const vmiLocationId = parameter.vmiLocationId;
    delete parameter.vmiLocationId;
    const vmiBinId = parameter.vmiBinId;
    delete parameter.vmiBinId;
    delete (parameter as any).onComplete;

    const vmiCounts = await get<VmiCountCollectionModel>(
        vmiBinCountsUrl.replace("{vmiLocationId}", vmiLocationId).replace("{vmiBinId}", vmiBinId),
        parameter,
    );

    return vmiCounts;
}
