import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{}, { websiteFavicon: string }>;

export const LookUpData: HandlerType = props => {
    const state = props.getState();

    if (IS_SERVER_SIDE) {
        return false;
    }

    props.websiteFavicon = state.context.website.websiteFavicon;
};

export const SetFaviconIfRequired: HandlerType = ({ websiteFavicon }) => {
    if (websiteFavicon) {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "icon");
            link.setAttribute("href", websiteFavicon);
            link.setAttribute("type", "image/x-icon");
            document.head.appendChild(link);
        }
    }
};

export const chain = [LookUpData, SetFaviconIfRequired];

export const setFavicon = createHandlerChainRunnerOptionalParameter(chain, {}, "SetFavicon");
