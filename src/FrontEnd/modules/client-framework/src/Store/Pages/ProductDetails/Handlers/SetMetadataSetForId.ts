import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ metadataSetForId: string }>;

export const DispatchSetMetadataSetForId: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/SetMetadataSetForId",
        metadataSetForId: props.parameter.metadataSetForId,
    });
};

export const chain = [DispatchSetMetadataSetForId];

const setMetadataSetForId = createHandlerChainRunner(chain, "SetMetadataSetForId");
export default setMetadataSetForId;
