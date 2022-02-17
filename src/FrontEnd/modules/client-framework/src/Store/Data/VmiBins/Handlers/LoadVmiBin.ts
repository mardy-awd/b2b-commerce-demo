import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getVmiBin, GetVmiBinApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { VmiBinModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiBinApiParameter, VmiBinModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter, expand: ["product"] };
};

export const DispatchBeginLoadVmiBin: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/BeginLoadVmiBin",
        id: props.parameter.vmiBinId!,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getVmiBin(props.apiParameter);
    } catch (error) {
        if ("status" in error && error.status === 404) {
            props.dispatch({
                type: "Data/VmiBins/FailedToLoadVmiBin",
                id: props.parameter.vmiBinId!,
                status: 404,
            });
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadVmiBin: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/CompleteLoadVmiBin",
        model: props.apiResult,
    });
};

export const chain = [PopulateApiParameter, DispatchBeginLoadVmiBin, RequestDataFromApi, DispatchCompleteLoadVmiBin];

const loadVmiBin = createHandlerChainRunner(chain, "LoadVmiBin");
export default loadVmiBin;
