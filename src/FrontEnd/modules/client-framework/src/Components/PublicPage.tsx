import BypassedAuthorizationWarning from "@insite/client-framework/Components/BypassedAuthorizationWarning";
import {
    createPageElement,
    registerPageUpdate,
    unregisterPageUpdate,
} from "@insite/client-framework/Components/ContentItemStore";
import ErrorModal from "@insite/client-framework/Components/ErrorModal";
import Footer from "@insite/client-framework/Components/Footer";
import Header from "@insite/client-framework/Components/Header";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { getDisplayErrorPage, getErrorStatusCode, redirectTo } from "@insite/client-framework/ServerSideRendering";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { setMetadata } from "@insite/client-framework/Store/CommonHandlers/SetMetadata";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
// eslint-disable-next-line spire/fenced-imports
import PageLayout from "@insite/content-library/PageLayout";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const page = getCurrentPage(state);
    return {
        page,
        websiteName: state.context.website.name,
        wasSetMetadataCalled: state.context.wasSetMetadataCalled,
        errorPageLink: getPageLinkByPageType(state, "UnhandledErrorPage"),
        permissionsLoaded: !!state.context.permissions,
    };
};

const mapDispatchToProps = {
    setMetadata,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

class PublicPage extends React.Component<Props> {
    componentDidMount() {
        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            registerPageUpdate(this.forceUpdate);
        }

        sendToShell({
            type: "LoadPageComplete",
            pageId: this.props.page.id,
            parentId: this.props.page.parentId,
            layoutPageId: this.props.page.layoutPageId,
        });
    }

    UNSAFE_componentWillMount() {
        if (!this.props.wasSetMetadataCalled) {
            this.props.setMetadata();
        }
    }

    componentWillUnmount() {
        if (module.hot) {
            unregisterPageUpdate(this.forceUpdate);
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.page.id !== prevProps.page?.id) {
            this.props.setMetadata();
        }
    }

    wrapContent(content: ReturnType<typeof createPageElement>) {
        const {
            page: {
                type,
                fields: { hideHeader, hideBreadcrumbs, hideFooter },
            },
        } = this.props;

        switch (type) {
            case "Header":
            case "Footer":
            case "SharedContent":
            case "VariantRootPage":
                return <>{content}</>;
        }

        const pageContent = (
            <>
                {content}
                <ErrorModal />
                <BypassedAuthorizationWarning />
            </>
        );

        const result = type.startsWith("Mobile/") ? (
            pageContent
        ) : (
            <PageLayout
                showHeader={!hideHeader}
                header={<Header />}
                pageContent={pageContent}
                showBreadcrumbs={!hideBreadcrumbs}
                showFooter={!hideFooter}
                footer={<Footer />}
            />
        );
        return <div data-test-selector={`page_${type}`}>{result}</div>;
    }

    render() {
        if (getDisplayErrorPage()) {
            const errorCode = getErrorStatusCode();
            if (errorCode === 403 || errorCode === 404) {
                this.props.page.type !== "NotFoundErrorPage" && redirectTo("/NotFoundErrorPage");
            } else if (this.props.errorPageLink) {
                this.props.page.type !== this.props.errorPageLink.type && redirectTo(this.props.errorPageLink.url);
            }
        }

        const {
            page,
            permissionsLoaded,
            shellContext: { isInShell },
        } = this.props;

        if (isInShell && page.type.startsWith("Mobile/") && !permissionsLoaded) {
            return null;
        }

        if (page.id === "") {
            return this.wrapContent(<p>Loading</p>);
        }

        return this.wrapContent(createPageElement(page.type, page));
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(PublicPage));
