import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { createContext } from "react";

export function getVmiBinState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.vmiBins, id);
}

export function getVmiBinsDataView(state: ApplicationState, getVmiBinsParameter: GetVmiBinsApiParameter) {
    return getDataView(state.data.vmiBins, getVmiBinsParameter);
}

export const VmiBinStateContext = createContext<ReturnType<typeof getVmiBinState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});

export const VmiBinsDataViewContext = createContext<ReturnType<typeof getVmiBinsDataView>>({
    value: undefined,
    isLoading: false,
});
