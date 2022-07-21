import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import Toaster from "@insite/mobius/Toast/Toaster";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import ErrorModal from "@insite/shell/Components/Modals/ErrorModal";
import LogoutWarningModal from "@insite/shell/Components/Modals/LogoutWarningModal";
import PageEditor from "@insite/shell/Components/PageEditor/PageEditor";
import PageTreeSideBar from "@insite/shell/Components/PageTree/PageTreeSideBar";
import SharedContentSideBar from "@insite/shell/Components/SharedContent/SharedContentSideBar";
import CompleteVersionHistoryModal from "@insite/shell/Components/Shell/CompleteVersionHistoryModal";
import ImportExportModal from "@insite/shell/Components/Shell/ImportExportModal";
import MainHeader from "@insite/shell/Components/Shell/MainHeader";
import MainNavigation from "@insite/shell/Components/Shell/MainNavigation";
import PublishComparer from "@insite/shell/Components/Shell/PublishComparer";
import RestoreContentModal from "@insite/shell/Components/Shell/RestoreContentModal";
import StyleGuideEditor from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import StyleGuidePreview from "@insite/shell/Components/Shell/StyleGuide/StyleGuidePreview";
import TopNavigationBar from "@insite/shell/Components/Shell/TopNavigationBar";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { isSharedContentOpened } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";

const menuItems = [{ url: "/", name: "", children: [] }];

const homePageLoader = (props: ReturnType<typeof mapStateToProps> & RouteComponentProps) => {
    useEffect(() => {
        if (isSharedContentOpened(props.history.location)) {
            return;
        }

        if (props.homePageId !== emptyGuid) {
            props.history.push(`/ContentAdmin/Page/${props.homePageId}`);
        }
    });

    return null;
};

const mapStateToProps = (state: ShellState) => ({
    homePageId: state.shellContext.mobileCmsModeActive
        ? state.shellContext.mobileHomePageId
        : state.shellContext.homePageId,
});

const HomePageLoader = connect(mapStateToProps)(withRouter(homePageLoader));

const FlexWrapper = styled.div`
    display: flex;
    height: 100%;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};

    .mdc-tab-scroller__scroll-area {
        overflow: hidden;
    }
`;

const SideBarArea = styled.div`
    padding-top: 40px;
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    overflow: hidden;
    position: relative;
    border-right: 1px solid #dedede;
`;

const MainArea = styled.div`
    width: calc(100% - ${(props: ShellThemeProps) => props.theme.sideBarWidth});
    padding-top: 39px;
`;

const layout = (
    <FlexWrapper>
        <Toaster>
            <TopNavigationBar />
            <SideBarArea>
                <MainNavigation />
                <Switch>
                    <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuideEditor} />
                    <Route path="/ContentAdmin/Page/" component={PageTreeSideBar} />
                    <Route path="/ContentAdmin/SharedContent/" component={SharedContentSideBar} />
                </Switch>
            </SideBarArea>
            <MainArea>
                <Switch>
                    <Route path={["/ContentAdmin/Page/*", "/ContentAdmin/SharedContent/*"]} component={MainHeader} />
                    <Route exact path={["/ContentAdmin/Design/StyleGuide", "/ContentAdmin/"]}>
                        <MainHeader disabled />
                    </Route>
                    <MainHeader />
                </Switch>
                <Switch>
                    <Route
                        exact
                        path={["/ContentAdmin/Page/:id", "/ContentAdmin/SharedContent/:id"]}
                        component={PageEditor}
                    />
                    <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuidePreview} />
                    <Route component={HomePageLoader} />
                </Switch>
            </MainArea>
            <LogoutWarningModal />
            <ErrorModal />
            <PublishComparer />
            <ImportExportModal />
            <RestoreContentModal />
            <CompleteVersionHistoryModal />
        </Toaster>
    </FlexWrapper>
);

export default layout;

export const SideBarStyle = styled.div<InjectableCss>`
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    height: calc(100vh - 40px);
    overflow: auto;
    ${injectCss}
`;
