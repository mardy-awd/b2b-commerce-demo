import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

export interface UpdatePasswordParameter {
    password: string;
    newPassword: string;
    onApiResponse: (error?: string) => void;
}


type HandlerType = ApiHandlerDiscreteParameter<
    UpdatePasswordParameter,
    UpdateSessionApiParameter,
    Session
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session:
        {
            ...props.parameter,
            uri: "",
            properties: {},
        },
    };
};

export const UpdateSession: HandlerType = async props => {
    try {
        props.apiResult = await updateSession(props.apiParameter);
        props.parameter.onApiResponse();
    } catch (error) {
        const errorMessage = JSON.parse(error.body || "{}").message || error.message;
        props.parameter.onApiResponse(errorMessage);
    }
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
];

const updatePassword = createHandlerChainRunner(chain, "UpdatePassword");
export default updatePassword;