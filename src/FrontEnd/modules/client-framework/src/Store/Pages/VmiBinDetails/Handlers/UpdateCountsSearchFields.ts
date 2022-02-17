import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";

type HandlerType = Handler<GetVmiCountsApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/UpdateVmiCountSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateCountsSearchFields = createHandlerChainRunner(chain, "UpdateCountsSearchFields");
export default updateCountsSearchFields;
