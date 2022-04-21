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
import loadVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocations";
import { getVmiLocationsDataView } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBins/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationId?: string }>(location.search);
    const getVmiLocationsParameter = {
        ...state.pages.vmiLocations.getVmiLocationsParameter,
        page: 1,
        pageSize: 9999, // need to get all locations
    };
    return {
        vmiBinsDataView: getVmiBinsDataView(state, state.pages.vmiBins.getVmiBinsParameter),
        getVmiBinsParameter: state.pages.vmiBins.getVmiBinsParameter,
        vmiLocationsDataView: getVmiLocationsDataView(state, getVmiLocationsParameter),
        getVmiLocationsParameter,
        parsedQuery,
    };
};

const mapDispatchToProps = {
    loadVmiBins,
    loadVmiLocations,
    updateSearchFields,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const VmiBinsPage = ({
    id,
    vmiBinsDataView,
    loadVmiBins,
    vmiLocationsDataView,
    loadVmiLocations,
    updateSearchFields,
    getVmiBinsParameter,
    getVmiLocationsParameter,
    parsedQuery,
}: Props) => {
    useEffect(() => {
        const pageSizeCookie = getCookie("VmiBins-PageSize");
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

        if (!vmiLocationsDataView.value && !vmiLocationsDataView.isLoading) {
            loadVmiLocations(getVmiLocationsParameter);
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
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const BinsPageContext = "VmiBinsPage";
