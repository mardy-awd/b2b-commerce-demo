import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import reloadPageIfAuthenticated from "@insite/client-framework/Store/Pages/SignIn/Handlers/ReloadPageIfAuthenticated";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = ({
    pages: {
        signIn: { isSigningInAsGuest },
    },
    context: { isSigningIn },
}: ApplicationState) => ({
    // This means the loading overlay shows until the browser redirects
    showLoadingOverlay: isSigningIn || isSigningInAsGuest,
});

const mapDispatchToProps = {
    reloadPageIfAuthenticated,
};

type Props = PageProps &
    ResolveThunks<typeof mapDispatchToProps> &
    ReturnType<typeof mapStateToProps> &
    HasShellContext;

const SignInPage = ({ id, showLoadingOverlay, reloadPageIfAuthenticated, shellContext: { isInShell } }: Props) => {
    useEffect(() => {
        if (!showLoadingOverlay && !isInShell) {
            reloadPageIfAuthenticated();
        }
    });

    return (
        <LoadingOverlay
            loading={showLoadingOverlay}
            css={css`
                width: 100%;
            `}
        >
            <Page data-test-selector="signIn">
                <Zone contentId={id} zoneName="Content" />
            </Page>
        </LoadingOverlay>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withIsInShell(SignInPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

/**
 * @deprecated Use string literal "SignInPage" instead of this constant.
 */
export const SignInPageContext = "SignInPage";
