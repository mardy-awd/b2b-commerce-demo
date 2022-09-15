import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetOrdersApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateTemporarySearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/UpdateTemporarySearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateTemporarySearchFields];

const updateTemporarySearchFields = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateTemporarySearchFields");
export default updateTemporarySearchFields;
