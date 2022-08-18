import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    isOpen?: boolean;
}>;

export const DispatchSetFlyoutDrawerIsOpen: HandlerType = ({ dispatch, parameter: { isOpen } }) => {
    dispatch({
        type: "Components/AddressDrawer/SetFlyoutDrawerIsOpen",
        isOpen,
    });
};

export const chain = [DispatchSetFlyoutDrawerIsOpen];

const setFlyoutDrawerIsOpen = createHandlerChainRunner(chain, "SetFlyoutDrawerIsOpen");
export default setFlyoutDrawerIsOpen;
