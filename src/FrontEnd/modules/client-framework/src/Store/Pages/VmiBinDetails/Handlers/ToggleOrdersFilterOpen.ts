import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ToggleOrdersFilter: Handler = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/ToggleOrdersFilterOpen",
    });
};

export const chain = [ToggleOrdersFilter];

const toggleOrdersFilterOpen = createHandlerChainRunnerOptionalParameter(chain, {}, "ToggleOrdersFilterOpen");
export default toggleOrdersFilterOpen;
