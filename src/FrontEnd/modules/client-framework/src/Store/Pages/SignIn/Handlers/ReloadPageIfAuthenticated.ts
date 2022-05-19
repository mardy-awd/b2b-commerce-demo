import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { get } from "@insite/client-framework/Services/ApiService";

type HandlerType = HandlerWithResult<{}, { isAuthenticatedOnServer: boolean }>;

export const SkipIfHasAccessToken: HandlerType = props => {
    if (props.getState().context.session.isAuthenticated && !props.getState().context.session.isGuest) {
        reloadPage();
        return false;
    }
};

export const RequestDataFromApi: HandlerType = async props => {
    props.result = await get<{ isAuthenticatedOnServer: boolean }>("/account/isauthenticated", {});
};

export const ProcessResponse: HandlerType = props => {
    if (props.result.isAuthenticatedOnServer && !props.getState().context.session.isGuest) {
        reloadPage();
    }
};

const reloadPage = () => {
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

export const chain = [SkipIfHasAccessToken, RequestDataFromApi, ProcessResponse];

const reloadPageIfAuthenticated = createHandlerChainRunnerOptionalParameter(chain, {}, "ReloadPageIfAuthenticated");
export default reloadPageIfAuthenticated;
