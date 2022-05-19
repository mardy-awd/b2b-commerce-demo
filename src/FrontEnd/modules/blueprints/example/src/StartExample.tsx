// import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Configuration";

// For production, include a set of commonly used widgets in the main bundle
// the rest will be split into their own chunks
// Do not do this for the ./Overrides folder
// const widgets = IS_PRODUCTION
//     ? require.context("./Widgets", true, /(Header|Basic|Common|Footer|SignIn)\/.+?\.tsx$/)
//     : require.context("./Widgets", true, /\.tsx$/);
// enable hot module reloading for widgets
// const onHotWidgetReplace = addWidgetsFromContext(widgets);
// if (module.hot) {
//     module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
// }

// Load all custom pages so they are included in the bundle and enable hot module reloading for them. Do not do this for the ./Overrides folder
// const pages = require.context("./Pages", true, /\.tsx$/);
// const onHotPageReplace = addPagesFromContext(pages);
// if (module.hot) {
//     module.hot.accept(pages.id, () => onHotPageReplace(require.context("./Pages", true, /\.tsx$/)));
// }

// Load all handlers so they are included in the bundle.
// const handlers = require.context("./Handlers", true);
// handlers.keys().forEach(key => handlers(key));

// in production, the widget extensions are included in the chunks created for widgets
// if (!IS_PRODUCTION) {
//     // load all widget extensions. They could be loaded individually instead
//     const widgetExtensions = require.context("./WidgetExtensions", true);
//     widgetExtensions.keys().forEach(key => widgetExtensions(key));
// }
