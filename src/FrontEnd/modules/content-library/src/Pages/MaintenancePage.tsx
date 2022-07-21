import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React from "react";

const MaintenancePage = ({ id }: PageProps) => (
    <Page>
        <Zone contentId={id} zoneName="Content" />
    </Page>
);

const pageModule: PageModule = {
    component: MaintenancePage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;
