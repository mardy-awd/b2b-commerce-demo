import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";

const VmiDashboardPage = ({ id }: PageProps) => {
    return (
        <Page data-test-selector="myAccount">
            <Zone contentId={id} zoneName="Content"></Zone>
        </Page>
    );
};

const pageModule: PageModule = {
    component: VmiDashboardPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;
