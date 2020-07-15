import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { HasLinksState } from "@insite/client-framework/Store/Links/LinksState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";

export const getPageLinkByNodeId = (state: HasLinksState, nodeId: string) => {
    const path = state.links.nodeIdToPageLinkPath[nodeId];
    if (!path) {
        return;
    }

    let result = state.links.pageLinks[path[0]];
    for (let index = 1; index < path.length; index = index + 1) {
        if (result.children) {
            result = result.children[path[index]];
        }
    }

    return result;
};

export const getPageLinkByPageType = (state: HasLinksState, pageType: string) => {
    const nodeId = state.links.pageTypesToNodeId[pageType];
    if (!nodeId) {
        return;
    }

    return getPageLinkByNodeId(state, nodeId);
};

export const getLink = (state: ApplicationState, { type, value }: LinkFieldValue) => {
    switch (type) {
    case "Page":
        return getPageLinkByNodeId(state, value);
    case "Category":
        return {
            url: value, // TODO ISC-10781 make this work
            title: value,
        };
    case "Url":
        return {
            url: value,
            title: value,
        };
    }
};

export interface LinkModel {
    fields: {
        openInNewWindow: boolean;
        destination: LinkFieldValue;
    }
}

export function mapLinks<L extends LinkModel, R = {}>(
    state: ApplicationState,
    links?: L[],
    optionalReturnFunction?: (widgetLink: L, stateLink?: ReturnType<typeof getLink>) => R,
) {
    if (!links || links.length < 1) return [];
    return links.map((widgetLink) => {
        const stateLink = getLink(state, widgetLink.fields.destination);
        const optionalReturnValues = typeof optionalReturnFunction === "function"
            ? optionalReturnFunction(widgetLink, stateLink)
            : {};
        return {
            url: stateLink?.url,
            title: stateLink?.title,
            ...optionalReturnValues,
        } as ReturnType<typeof getLink> & R;
    });
}

export function getCategoryLink(state: HasLinksState, categoryId: string) {
    return state.links.UNSAFE_categoryLinksById[categoryId];
}

export function getCategoryDepthLoaded(state: HasLinksState, categoryId: string) {
    return state.links.UNSAFE_categoryDepthLoaded[categoryId];
}