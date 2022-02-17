import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetVmiCountsApiParameter } from "@insite/client-framework/Services/VmiCountsService";

type HandlerType = Handler<GetVmiCountsApiParameter>;

export const DispatchUpdateUserSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/UpdateVmiCountsUserSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateUserSearchFields];

const updateUserSearchFields = createHandlerChainRunner(chain, "UpdateUserSearchFields");
export default updateUserSearchFields;
