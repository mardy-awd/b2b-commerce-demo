import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getVmiBinCount, GetVmiBinCountApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { VmiBinCountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiBinCountApiParameter, VmiBinCountModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { numberOfTimesMinQtyReached: 2, numberOfVisits: 4 } as GetVmiBinCountApiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVmiBinCount(props.apiParameter);
};

export const DispatchCompleteLoadVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiDashboard/CompleteLoadFastMovingCount",
        result: props.apiResult,
    });
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadVmiBins];

const loadFastMovingCount = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadFastMovingCount");
export default loadFastMovingCount;
