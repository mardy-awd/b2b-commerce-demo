import { getCookie } from "@insite/client-framework/Common/Cookies";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/LoadVmiBins";
import {
    getVmiBinsDataView,
    VmiBinsDataViewContext,
} from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationId?: string }>(location.search);
    return {
        vmiBinsDataView: getVmiBinsDataView(state, state.pages.vmiReporting.getVmiBinsParameter),
        getVmiBinsParameter: state.pages.vmiReporting.getVmiBinsParameter,
        parsedQuery,
    };
};

const mapDispatchToProps = {
    loadVmiBins,
    updateSearchFields,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const VmiReportingPage = ({
    id,
    vmiBinsDataView,
    loadVmiBins,
    updateSearchFields,
    getVmiBinsParameter,
    parsedQuery,
}: Props) => {
    useEffect(() => {
        const pageSizeCookie = getCookie("VmiReporting-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== getVmiBinsParameter.pageSize) {
            updateSearchFields({ pageSize });
            return;
        }

        if (parsedQuery.locationId && parsedQuery.locationId !== getVmiBinsParameter.vmiLocationId) {
            updateSearchFields({ vmiLocationId: parsedQuery.locationId });
            return;
        }

        if (!vmiBinsDataView.value && !vmiBinsDataView.isLoading && getVmiBinsParameter.vmiLocationId) {
            loadVmiBins(getVmiBinsParameter);
        }
    });

    return (
        <Page>
            <VmiBinsDataViewContext.Provider value={vmiBinsDataView}>
                <Zone contentId={id} zoneName="Content" />
            </VmiBinsDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiReportingPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const VmiReportingPageContext = "VmiReportingPage";
