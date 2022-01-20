import setPageMetadata, { Metadata } from "@insite/client-framework/Common/Utilities/setPageMetadata";
import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getAlternateLanguageUrls, getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{}, { metadata?: Metadata; websiteSettings?: WebsiteSettingsModel }>;

export const DispatchCalledSetMetadata: HandlerType = ({ dispatch }) => {
    // we use this to determine if we need to call this handler during SSR
    dispatch({ type: "Context/CalledSetMetadata" });
};

export const ShouldSetMetadata: HandlerType = ({ getState, dispatch }) => {
    const state = getState();
    const page = getCurrentPage(state);

    if (
        !page ||
        page.type === "ProductListPage" ||
        page.type === "ProductDetailsPage" ||
        page.type === "CategoryDetailsPage"
    ) {
        return false;
    }
};

export const LookUpData: HandlerType = props => {
    const state = props.getState();
    const page = getCurrentPage(state);

    const pathname = state.data.pages.location.pathname;
    const alternateLanguageUrls = getAlternateLanguageUrls(state, page.id);
    const websiteName = state.context.website.name;

    props.metadata = {
        metaKeywords: page.fields.metaKeywords,
        metaDescription: page.fields.metaDescription,
        openGraphUrl: page.fields.openGraphUrl,
        openGraphTitle: page.fields.openGraphTitle,
        openGraphImage: page.fields.openGraphImage,
        title: page.fields.title,
        currentPath: pathname,
        canonicalPath: pathname,
        alternateLanguageUrls,
        websiteName,
    };

    props.websiteSettings = getSettingsCollection(state).websiteSettings;
};

export const SetMetadata: HandlerType = ({ metadata, websiteSettings, dispatch }) => {
    if (metadata) {
        setPageMetadata(metadata, websiteSettings);
    }
};

export const chain = [DispatchCalledSetMetadata, ShouldSetMetadata, LookUpData, SetMetadata];

export const setMetadata = createHandlerChainRunnerOptionalParameter(chain, {}, "SetMetaData");
