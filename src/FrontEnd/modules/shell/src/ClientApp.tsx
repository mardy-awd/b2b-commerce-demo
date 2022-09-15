import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";
import translate from "@insite/client-framework/Translate";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import BrandStyles from "@insite/shell/BrandStyles";
import * as LayoutModule from "@insite/shell/Components/Layout";
import ConfirmationProvider from "@insite/shell/Components/Modals/ConfirmationProvider";
import { trackUserEvents } from "@insite/shell/Services/AccessTokenService";
import { setReduxDispatcher } from "@insite/shell/Services/ServiceBase";
import shellTheme from "@insite/shell/ShellTheme";
import { parseAdminTokenFromLocalStorage } from "@insite/shell/Store/BearerToken";
import { configureStore } from "@insite/shell/Store/ConfigureStore";
import { clearCookiesAndStorage } from "@insite/shell/Store/ShellContext/ShellContextReducer";
import ShellState from "@insite/shell/Store/ShellState";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as React from "react";
import { createRoot, hydrateRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { css } from "styled-components";

const pages = require.context("../../client-framework/src/Internal/Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);

const widgets = require.context("../../client-framework/src/Internal/Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

let layout = LayoutModule.default;
let theme = shellTheme;

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ShellState;
const store = configureStore(history, initialState);
const container = document.getElementById("react-app") as Element;

const loadingCss = css`
    display: block;
    height: 100vh;
`;

function renderApp(root: Root = createRoot(container)) {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    const token = parseAdminTokenFromLocalStorage();
    let shell: JSX.Element;
    if (!token) {
        clearCookiesAndStorage();
        window.location.href = `/admin/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
        shell = <LoadingOverlay loading css={loadingCss} />;
    } else {
        trackUserEvents(store.dispatch);
        shell = (
            <Provider store={store}>
                <ConfirmationProvider>
                    <ConnectedRouter history={history}>{layout}</ConnectedRouter>
                </ConfirmationProvider>
            </Provider>
        );
    }

    setReduxDispatcher(store.dispatch);

    root.render(
        <ThemeProvider theme={theme} createGlobalStyle={true} createChildGlobals={false} translate={translate}>
            <BrandStyles />
            {shell}
        </ThemeProvider>,
    );
}

renderApp(initialState ? hydrateRoot(container, <></>) : createRoot(container));

if (module.hot) {
    module.hot.accept(pages.id, () =>
        onHotPageReplace(require.context("../../client-framework/src/Internal/Pages", true, /\.tsx$/)),
    );

    module.hot.accept(widgets.id, () =>
        onHotWidgetReplace(require.context("../../client-framework/src/Internal/Widgets", true, /\.tsx$/)),
    );

    module.hot.accept("@insite/shell/Components/Layout", () => {
        // eslint-disable-next-line global-require
        layout = require<typeof LayoutModule>("@insite/shell/Components/Layout").default;
        renderApp();
    });

    module.hot.accept("@insite/shell/ShellTheme", () => {
        // eslint-disable-next-line global-require
        theme = require("@insite/shell/ShellTheme").shellTheme;
        renderApp();
    });
}
