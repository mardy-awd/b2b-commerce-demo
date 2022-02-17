import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { deleteVmiBins, DeleteVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/LoadVmiBins";
import { VmiBinCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<DeleteVmiBinsApiParameter, VmiBinCollectionModel>;

export const DispatchBeginRemoveVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/BeginRemoveVmiBins",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RemoveDataFromApi: HandlerType = props => {
    deleteVmiBins(props.apiParameter).then(() => {
        const state = props.getState();
        const currentPage = getCurrentPage(state);
        if (currentPage.type === "VmiBinsPage") {
            props.dispatch(loadVmiBins(state.pages.vmiBins.getVmiBinsParameter));
        } else {
            props.dispatch(loadVmiBins(state.pages.vmiLocationDetails.getVmiBinsParameter));
        }
    });
};

export const DispatchClearDataView: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/Reset",
    });
};

export const chain = [PopulateApiParameter, DispatchBeginRemoveVmiBins, RemoveDataFromApi, DispatchClearDataView];

const removeVmiBins = createHandlerChainRunner(chain, "RemoveVmiBins");
export default removeVmiBins;
