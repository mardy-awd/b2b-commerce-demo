import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getVmiBinCount, GetVmiBinCountApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { VmiBinCountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiBinCountApiParameter, VmiBinCountModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { numberOfPreviousOrders: 0, numberOfVisits: 2 } as GetVmiBinCountApiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVmiBinCount(props.apiParameter);
};

export const DispatchCompleteLoadVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiDashboard/CompleteLoadSlowMovingCount",
        result: props.apiResult,
    });
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadVmiBins];

const loadSlowMovingCount = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSlowMovingCount");
export default loadSlowMovingCount;
