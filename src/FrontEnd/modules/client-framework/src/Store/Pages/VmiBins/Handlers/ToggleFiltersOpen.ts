import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ToggleBinsFilter: Handler = props => {
    props.dispatch({
        type: "Pages/VmiBins/ToggleFiltersOpen",
    });
};

export const chain = [ToggleBinsFilter];

const toggleFiltersOpen = createHandlerChainRunnerOptionalParameter(chain, {}, "ToggleFiltersOpen");
export default toggleFiltersOpen;
