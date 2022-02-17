import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

interface Parameter {
    modalIsOpen: boolean;
}

type HandlerType = Handler<Parameter>;

export const DispatchSetModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/VmiBinsImportModal/SetModalIsOpen",
        isOpen: props.parameter.modalIsOpen,
    });
};

export const chain = [DispatchSetModalIsOpen];

const setVmiBinsImportModalIsOpen = createHandlerChainRunner(chain, "SetVmiBinsImportModalIsOpen");
export default setVmiBinsImportModalIsOpen;
