import {
    ApiHandlerNoParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { AdyenSettings, getAdyenSettings } from "@insite/client-framework/Services/SettingsService";

type HandlerType = ApiHandlerNoParameter<AdyenSettings>;

export const GetAdyenSettings: HandlerType = async props => {
    props.apiResult = await getAdyenSettings();
};

export const DispatchCompleteLoadAdyenSettings: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadAdyenSettings",
        adyenSettings: props.apiResult,
    });
};

export const chain = [GetAdyenSettings, DispatchCompleteLoadAdyenSettings];

const loadAdyenSettings = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadAdyenSettings");
export default loadAdyenSettings;
