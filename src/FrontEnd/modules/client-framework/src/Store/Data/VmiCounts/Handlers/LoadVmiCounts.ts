import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getVmiCounts, GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";
import { VmiCountCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiCountsApiParameter, VmiCountCollectionModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const DispatchBeginLoadVmiCounts: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiCounts/BeginLoadVmiCounts",
        parameter: props.parameter,
    });
};

export const DispatchClearVmiCountChecks: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ClearVmiItemChecks",
        tabKey: TableTabKeys.PreviousCounts,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVmiCounts(props.apiParameter);
};

export const DispatchCompleteLoadVmiCounts: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiCounts/CompleteLoadVmiCounts",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadVmiCounts,
    DispatchClearVmiCountChecks,
    RequestDataFromApi,
    DispatchCompleteLoadVmiCounts,
];

const loadVmiCounts = createHandlerChainRunner(chain, "LoadVmiCounts");
export default loadVmiCounts;
