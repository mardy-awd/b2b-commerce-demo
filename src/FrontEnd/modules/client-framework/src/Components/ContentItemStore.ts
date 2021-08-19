import { Dictionary } from "@insite/client-framework/Common/Types";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import logger from "@insite/client-framework/Logger";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { PageDefinition, WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import PageModule from "@insite/client-framework/Types/PageModule";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import * as React from "react";

type RequireContext = __WebpackModuleApi.RequireContext;

interface FoundModule<T extends WidgetModule | PageModule> {
    /** The default export is expected to be the component itself. */
    readonly default?: T;
}

const widgetComponents: Dictionary<React.ComponentType<HasFields>> = {};
const widgetDefinitions: Dictionary<WidgetDefinition> = {};
const pageComponents: Dictionary<React.ComponentType<HasFields>> = {};
/**
 * @deprecated Use DefinitionLoader.getPageDefinitions instead.
 */
export const pageDefinitions: Dictionary<PageDefinition> = {};

function loadPages(foundItems: RequireContext) {
    loadItems(foundItems, "Page", (component: FoundModule<PageModule>, type: string) => {
        pageComponents[type] = component.default!.component;
        pageDefinitions[type] = component.default!.definition;
    });
}

function loadWidgets(foundItems: RequireContext) {
    loadItems(foundItems, "Widget", (component: FoundModule<WidgetModule>, type: string) => {
        widgetComponents[type] = component.default!.component;
        widgetDefinitions[type] = component.default!.definition;
    });
}

function loadItems<T extends FoundModule<PageModule | WidgetModule>>(
    foundItems: RequireContext,
    itemType: string,
    action: (component: T, type: string) => void,
) {
    for (const foundItemKey of foundItems.keys()) {
        if (foundItemKey.includes(".test.") || foundItemKey.includes("TestRendering/helpers.tsx")) {
            continue;
        }

        const type = foundItemKey.replace("./", "").replace(".tsx", "");
        const component = foundItems<T>(foundItemKey);

        if (!component.default) {
            continue;
        }

        if (!component.default.component && component.default.definition) {
            logger.error(
                `The ${itemType} at '${foundItemKey}' did not properly export a ${itemType}Module. It is missing a component property.`,
            );
            continue;
        }

        if (component.default.component && !component.default.definition) {
            logger.error(
                `The ${itemType} at '${foundItemKey}' did not properly export a ${itemType}Module. It is missing a definition property.`,
            );
            continue;
        }

        if (component.default.component && component.default.definition) {
            action(component, type);
        }
    }
}

/**
 * Provides a source for widgets.
 * The returned function can be called during hot replacement events to reload the items.
 * @param widgets Context (via `require.context`) for widgets to add.
 * @returns A function to reload widgets that have changed while otherwise preserving state of the view.
 * @example
 * const widgets = require.context('./Widgets', true, /\.tsx$/);
 * const onHotWidgetReplace = addWidgetsFromContext(widgets);
 *
 * if (module.hot) {
 *     module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context('./Widgets', true, /\.tsx$/)));
 * }
 */
export function addWidgetsFromContext(widgets: RequireContext) {
    loadWidgets(widgets);

    const onHotWidgetReplace = (replacements: RequireContext) => {
        loadWidgets(replacements);

        for (const update of widgetForceUpdates) {
            update();
        }
    };

    return onHotWidgetReplace;
}

/**
 * Provides a source for widgets.
 * The returned function can be called during hot replacement events to reload the items.
 * @param pages Context (via `require.context`) for pages to add.
 * @returns A function to reload pages that have changed while otherwise preserving state of the view.
 * @example
 * const pages = require.context('./Pages', true, /\.tsx$/);
 * const onHotPageReplace = addPagesFromContext(pages);
 *
 * if (module.hot) {
 *     module.hot.accept(pages.id, () => onHotPageReplace(require.context('./Pages', true, /\.tsx$/)));
 * }
 */
export function addPagesFromContext(pages: RequireContext) {
    loadPages(pages);

    const onHotPageReplace = (replacements: RequireContext) => {
        loadPages(replacements);

        for (const update of pageForceUpdates) {
            update();
        }
    };

    return onHotPageReplace;
}

const widgets = require.context("../../../content-library/src/Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

const pages = require.context("../../../content-library/src/Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);

if (module.hot) {
    module.hot.accept(widgets.id, () =>
        onHotWidgetReplace(require.context("../../../content-library/src/Widgets", true, /\.tsx$/)),
    );
    module.hot.accept(pages.id, () =>
        onHotPageReplace(require.context("../../../content-library/src/Pages", true, /\.tsx$/)),
    );
}

export function createPageElement(type: string, props: HasFields) {
    if (type === nullPage.type) {
        return null;
    }

    if (!pageComponents[type]) {
        return React.createElement(MissingComponent, { type, isWidget: false });
    }

    return React.createElement(pageComponents[type], props);
}

export function createWidgetElement(type: string, props: HasFields) {
    if (!widgetComponents[type]) {
        return React.createElement(MissingComponent, { type, isWidget: true });
    }

    return React.createElement(widgetComponents[type], props);
}

const widgetForceUpdates: (() => void)[] = [];

export function registerWidgetUpdate(forceUpdate: () => void) {
    widgetForceUpdates.push(forceUpdate);
}

export function unregisterWidgetUpdate(forceUpdate: () => void) {
    const index = widgetForceUpdates.indexOf(forceUpdate);
    if (index >= 0) {
        widgetForceUpdates.splice(index, 1);
    }
}

const pageForceUpdates: (() => void)[] = [];

export function registerPageUpdate(forceUpdate: () => void) {
    pageForceUpdates.push(forceUpdate);
}

export function unregisterPageUpdate(forceUpdate: () => void) {
    const index = pageForceUpdates.indexOf(forceUpdate);
    if (index >= 0) {
        pageForceUpdates.splice(index, 1);
    }
}

export function getTheWidgetDefinitions(): Dictionary<WidgetDefinition> {
    return widgetDefinitions;
}

/**
 * @deprecated Use DefinitionLoader.getPageDefinitions instead.
 */
export function getThePageDefinitions(): Dictionary<PageDefinition> {
    return pageDefinitions;
}

let isWebCrawler: boolean;

export function setIsWebCrawler(value: boolean) {
    isWebCrawler = value;
}

export function getIsWebCrawler() {
    return isWebCrawler;
}

export function checkIsWebCrawler(userAgent: string): boolean {
    const botString = /bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google/;
    const regExp = new RegExp(botString, "i");
    return regExp.test(userAgent);
}
