import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";

export const getWidgetsByIdAndZone = (state: ApplicationState, id: string, zoneName: string): WidgetProps[] => {
    const widgetIdsUnderParentId = state.data.pages.widgetIdsByParentIdAndZone[id];
    if (typeof widgetIdsUnderParentId === "undefined") {
        return [];
    }

    const widgetIdsInZone = widgetIdsUnderParentId[zoneName];
    if (typeof widgetIdsInZone === "undefined") {
        return [];
    }

    return widgetIdsInZone.map(o => state.data.pages.widgetsById[o]);
};

export const getWidgetsByPageId = (state: ApplicationState, pageId: string): WidgetProps[] => {
    const widgetIdsByPageId = state.data.pages.widgetIdsByPageId[pageId];
    if (typeof widgetIdsByPageId === "undefined") {
        return [];
    }

    return widgetIdsByPageId.map(o => state.data.pages.widgetsById[o]);
};
