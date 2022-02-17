import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ToggleCountsFilter: Handler = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ToggleCountsFilterOpen",
    });
};

export const chain = [ToggleCountsFilter];

const toggleCountsFilterOpen = createHandlerChainRunnerOptionalParameter(chain, {}, "ToggleCountsFilterOpen");
export default toggleCountsFilterOpen;
