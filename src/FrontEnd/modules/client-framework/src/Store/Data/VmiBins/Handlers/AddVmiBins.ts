import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { AddVmiBinCollectionApiParameter, createVmiBins } from "@insite/client-framework/Services/VmiBinsService";
import { VmiBinCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<AddVmiBinCollectionApiParameter, ServiceResult<VmiBinCollectionModel>>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await createVmiBins(props.apiParameter);
};

export const DispatchResetVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/Reset",
    });
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetVmiBins];

const addVmiBins = createHandlerChainRunner(chain, "AddVmiBins");
export default addVmiBins;
