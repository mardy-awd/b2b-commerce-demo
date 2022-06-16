import { getHeadTrackingScript, getNoscriptTrackingScript } from "@insite/client-framework/Common/Utilities/tracking";
import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { Session } from "@insite/client-framework/Services/SessionService";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";

type HandlerType = Handler<{}, { session: Session; settings: SettingsModel }>;

export const LookUpData: HandlerType = props => {
    const state = props.getState();

    if (IS_SERVER_SIDE) {
        return false;
    }

    props.session = state.context.session;
    props.settings = state.context.settings;
};

export const SetNoscriptTrackingScript: HandlerType = ({ settings }) => {
    const noscriptTrackingScript = getNoscriptTrackingScript(settings);
    if (noscriptTrackingScript) {
        let noscript = document.getElementById("noscriptTrackingScript");
        if (!noscript) {
            noscript = document.createElement("noscript");
            noscript.setAttribute("id", "noscriptTrackingScript");
            noscript.innerHTML = noscriptTrackingScript;
            document.body.appendChild(noscript);
        }
    }
};

export const SetHeadTrackingScript: HandlerType = ({ session, settings }) => {
    const headTrackingScript = getHeadTrackingScript(settings, session);
    if (headTrackingScript) {
        let script = document.getElementById("headTrackingScript");
        if (!script) {
            script = document.createElement("script");
            script.setAttribute("id", "headTrackingScript");
            script.innerHTML = headTrackingScript;
            document.head.appendChild(script);
        }
    }
};

export const chain = [LookUpData, SetNoscriptTrackingScript, SetHeadTrackingScript];

export const setTracking = createHandlerChainRunnerOptionalParameter(chain, {}, "SetTracking");
