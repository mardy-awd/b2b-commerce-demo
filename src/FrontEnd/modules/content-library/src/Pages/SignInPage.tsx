import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import reloadPageIfAuthenticated from "@insite/client-framework/Store/Pages/SignIn/Handlers/ReloadPageIfAuthenticated";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const {
        pages: {
            signIn: { isSigningInAsGuest },
        },
        context: { isSigningIn },
    } = state;
    const queryParams = parseQueryString<{ returnUrl?: string; clientRedirect?: string }>(getLocation(state).search);
    const lowerCaseReturnUrl = queryParams.returnUrl?.toLowerCase();
    const myListsDetailsPageUrl = getPageLinkByPageType(state, "MyListsDetailsPage")?.url;
    const staticListPageUrl = getPageLinkByPageType(state, "StaticListPage")?.url;

    let invitedToList = false;
    if (
        lowerCaseReturnUrl &&
        myListsDetailsPageUrl &&
        lowerCaseReturnUrl.indexOf(myListsDetailsPageUrl.toLowerCase()) > -1 &&
        lowerCaseReturnUrl.indexOf("invite=") > -1
    ) {
        invitedToList = true;
    }

    let staticListId;
    let navigatedFromStaticList = false;
    const idParam = "?id=";
    if (
        lowerCaseReturnUrl &&
        staticListPageUrl &&
        lowerCaseReturnUrl.indexOf(staticListPageUrl.toLowerCase()) > -1 &&
        lowerCaseReturnUrl.indexOf(idParam) > -1 &&
        !queryParams.clientRedirect
    ) {
        const start = lowerCaseReturnUrl.indexOf(idParam) + idParam.length;
        staticListId = lowerCaseReturnUrl.substring(start, start + 36);
        navigatedFromStaticList = true;
    }

    const staticListState = getWishListState(state, staticListId);
    return {
        // This means the loading overlay shows until the browser redirects
        showLoadingOverlay: isSigningIn || isSigningInAsGuest || staticListState.isLoading,
        invitedToList,
        navigatedFromStaticList,
        staticListId,
        staticListState,
    };
};

const mapDispatchToProps = {
    reloadPageIfAuthenticated,
    loadWishList,
};

type Props = PageProps &
    ResolveThunks<typeof mapDispatchToProps> &
    ReturnType<typeof mapStateToProps> &
    HasShellContext;

export interface SignInPageStyles {
    modal?: ModalPresentationProps;
    innerWrapper?: InjectableCss;
    messageText?: TypographyPresentationProps;
    buttonsWrapper?: InjectableCss;
    closeButton?: ButtonPresentationProps;
}

export const signInPageStyles: SignInPageStyles = {
    modal: {
        size: 500,
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    closeButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const styles = signInPageStyles;

const SignInPage = ({
    id,
    showLoadingOverlay,
    invitedToList,
    navigatedFromStaticList,
    staticListId,
    staticListState,
    reloadPageIfAuthenticated,
    loadWishList,
    shellContext: { isInShell },
}: Props) => {
    const [signInRequiredModalIsOpen, setSignInRequiredModalIsOpen] = useState(false);

    useEffect(() => {
        if (!showLoadingOverlay && !isInShell) {
            reloadPageIfAuthenticated();
        }
    });

    useEffect(() => {
        if (invitedToList) {
            setSignInRequiredModalIsOpen(true);
        }
    }, [invitedToList]);

    useEffect(() => {
        if (navigatedFromStaticList && staticListId) {
            loadWishList({ wishListId: staticListId, expand: ["staticList"], exclude: ["listLines"] });
        }
    }, [navigatedFromStaticList]);

    useEffect(() => {
        if (!staticListState.isLoading && staticListState.value) {
            setSignInRequiredModalIsOpen(true);
        }
    }, [staticListState]);

    const signInRequiredModalCloseHandler = () => {
        setSignInRequiredModalIsOpen(false);
    };

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
            <Modal
                {...styles.modal}
                headline={translate("Please Sign In or Create an Account")}
                isOpen={signInRequiredModalIsOpen}
                handleClose={signInRequiredModalCloseHandler}
            >
                <StyledWrapper {...styles.innerWrapper}>
                    {invitedToList && (
                        <Typography {...styles.messageText}>
                            {siteMessage("Lists_SignIn_Required_To_Join_List")}
                        </Typography>
                    )}
                    {navigatedFromStaticList && staticListState.value && (
                        <Typography {...styles.messageText}>
                            {translate("In order to view the list shared by")}
                            {` ${staticListState.value.sharedByDisplayName}, `}
                            {translate("please sign in or create an account.")}
                        </Typography>
                    )}
                    <StyledWrapper {...styles.buttonsWrapper}>
                        <Button {...styles.closeButton} onClick={signInRequiredModalCloseHandler}>
                            {translate("Close")}
                        </Button>
                    </StyledWrapper>
                </StyledWrapper>
            </Modal>
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
