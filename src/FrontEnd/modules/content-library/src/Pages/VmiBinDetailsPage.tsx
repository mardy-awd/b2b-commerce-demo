import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadVmiBin from "@insite/client-framework/Store/Data/VmiBins/Handlers/LoadVmiBin";
import { getVmiBinState, VmiBinStateContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationId?: string; id?: string }>(location.search);
    const homePageUrl = getHomePageUrl(state);
    return {
        vmiBinState: getVmiBinState(state, parsedQuery.id),
        breadcrumbLinks: state.components.breadcrumbs.links,
        parentNodeId: getCurrentPage(state).parentId,
        links: state.links,
        homePageUrl,
        parsedQuery,
    };
};

const mapDispatchToProps = {
    loadVmiBin,
    setBreadcrumbs,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class VmiBinDetailsPage extends React.PureComponent<Props> {
    private checkState(prevProps?: Props) {
        if (!this.props.breadcrumbLinks && this.props.vmiBinState.value) {
            const newLinks = generateLinksFrom(this.props.links, this.props.parentNodeId, this.props.homePageUrl);
            const vmiProducts = newLinks.pop();
            if (vmiProducts && this.props.parsedQuery.locationId) {
                vmiProducts.href += `?locationId=${this.props.parsedQuery.locationId}`;
                newLinks.push(vmiProducts);
            }
            newLinks.push({ children: this.props.vmiBinState.value?.product?.shortDescription });
            this.props.setBreadcrumbs({ links: newLinks });
        }
    }

    private loadVmiBinIfRequired() {
        if (
            !this.props.vmiBinState.value &&
            !this.props.vmiBinState.isLoading &&
            this.props.parsedQuery.locationId &&
            this.props.parsedQuery.id
        ) {
            this.props.loadVmiBin({
                vmiLocationId: this.props.parsedQuery.locationId,
                vmiBinId: this.props.parsedQuery.id,
            });
        }
    }

    UNSAFE_componentWillMount() {
        this.loadVmiBinIfRequired();
        this.checkState();
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.props.vmiBinState.isLoading && !this.props.vmiBinState.value) {
            this.props.setBreadcrumbs({ links: undefined });
        }
        this.loadVmiBinIfRequired();
        this.checkState(prevProps);
    }

    render() {
        return (
            <Page>
                <VmiBinStateContext.Provider value={this.props.vmiBinState}>
                    <Zone contentId={this.props.id} zoneName="Content" />
                </VmiBinStateContext.Provider>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const BinDetailsPageContext = "VmiBinDetailsPage";
