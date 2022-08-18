import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    addPaymentProfile as addPaymentProfileApi,
    AddPaymentProfileApiParameter,
} from "@insite/client-framework/Services/AccountService";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<
    AddPaymentProfileApiParameter & HasOnSuccess & HasOnError<string>,
    AccountPaymentProfileModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await addPaymentProfileApi(props.parameter);
    } catch (error) {
        if ("errorMessage" in error) {
            props.parameter.onError?.(error.errorMessage as string);
        }

        return false;
    }
};

export const DispatchResetPaymentProfiles: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetPaymentProfiles, ExecuteOnSuccessCallback];

const addPaymentProfile = createHandlerChainRunner(chain, "AddPaymentProfile");
export default addPaymentProfile;
