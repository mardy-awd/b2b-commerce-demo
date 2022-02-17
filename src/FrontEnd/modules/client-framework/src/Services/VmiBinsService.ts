import {
    ApiParameter,
    get,
    HasPagingParameters,
    patch,
    post,
    requestVoid,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { VmiBinCollectionModel, VmiBinCountModel, VmiBinModel } from "@insite/client-framework/Types/ApiModels";

const vmiLocationBinsUrl = "api/v1/vmiLocations/{vmiLocationId}/bins";
const vmiLocationBinCountUrl = "api/v1/vmiBins/count";

export interface AddVmiBinApiParameter extends ApiParameter {
    vmiLocationId: string;
    vmiBin: Partial<VmiBinModel>;
}

export interface GetVmiBinApiParameter extends ApiParameter {
    vmiLocationId?: string;
    vmiBinId?: string;
    expand?: "product"[];
}

export interface UpdateVmiBinApiParameter extends ApiParameter {
    vmiBin: VmiBinModel;
}

export interface AddVmiBinCollectionApiParameter extends ApiParameter {
    vmiLocationId: string;
    vmiBins: VmiBinModel[];
}

export interface GetVmiBinsApiParameter extends ApiParameter, HasPagingParameters {
    vmiLocationId?: string;
    filter?: string;
    binNumberFrom?: string;
    binNumberTo?: string;
    previousCountFromDate?: string;
    previousCountToDate?: string;
    isBelowMinimum?: boolean;
    numberOfTimesMinQtyReached?: number;
    numberOfPreviousOrders?: number;
    numberOfVisits?: number;
    expand?: "product"[];
}

export interface GetVmiBinCountApiParameter extends ApiParameter {
    isBelowMinimum?: boolean;
    numberOfPreviousOrders?: number;
    numberOfTimesMinQtyReached?: number;
    numberOfVisits?: number;
}

export interface DeleteVmiBinsApiParameter extends ApiParameter {
    vmiLocationId: string;
    ids: string[];
}

export async function createVmiBin(parameter: AddVmiBinApiParameter): Promise<ServiceResult<VmiBinModel>> {
    try {
        const vmiBinModel = await post<VmiBinModel>(
            vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId),
            parameter.vmiBin as VmiBinModel,
        );
        return {
            result: vmiBinModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function getVmiBin(parameter: GetVmiBinApiParameter) {
    if (!parameter.vmiLocationId) {
        throw Error("vmiLocationId is required");
    }

    const vmiLocationId = parameter.vmiLocationId;
    delete parameter.vmiLocationId;
    const vmiBinId = parameter.vmiBinId;
    delete parameter.vmiBinId;
    const vmiBin = await get<VmiBinModel>(
        `${vmiLocationBinsUrl.replace("{vmiLocationId}", vmiLocationId)}/${vmiBinId}`,
        parameter,
    );
    return vmiBin;
}

export async function patchVmiBin(parameter: UpdateVmiBinApiParameter): Promise<ServiceResult<VmiBinModel>> {
    try {
        const vmiBinModel = await patch<VmiBinModel>(parameter.vmiBin.uri, parameter.vmiBin);
        return {
            result: vmiBinModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function createVmiBins(
    parameter: AddVmiBinCollectionApiParameter,
): Promise<ServiceResult<VmiBinCollectionModel>> {
    try {
        const vmiBinCollectionModel = await post<VmiBinModel[], VmiBinCollectionModel>(
            `${vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId)}/batch`,
            parameter.vmiBins,
        );
        return {
            result: vmiBinCollectionModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function getVmiBins(parameter: GetVmiBinsApiParameter) {
    if (!parameter.vmiLocationId) {
        throw Error("vmiLocationId is required");
    }

    const vmiBins = await get<VmiBinCollectionModel>(
        vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId),
        parameter,
    );
    return vmiBins;
}

export async function getVmiBinCount(parameter: GetVmiBinCountApiParameter) {
    const vmiBinCount = await get<VmiBinCountModel>(vmiLocationBinCountUrl, parameter);
    return vmiBinCount;
}

export function deleteVmiBins(parameter: DeleteVmiBinsApiParameter) {
    const query = parameter.ids.map(o => `ids=${o}`).join("&");
    return requestVoid(
        `${vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId)}/batch?${query}`,
        "DELETE",
        {
            "Content-Type": "application/json",
        },
    );
}
