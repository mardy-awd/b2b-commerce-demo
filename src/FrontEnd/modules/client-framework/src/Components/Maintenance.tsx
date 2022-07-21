import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { HasShellContext, ShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { value: maintenancePage, isLoading } = getPageStateByType(state, "MaintenancePage");
    const { maintenanceModeEnabled } = getSettingsCollection(state).websiteSettings;
    return {
        maintenanceModeEnabled,
        maintenancePage,
        isLoading,
    };
};

const mapDispatchToProps = {
    loadPageByType,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

const Maintenance: FC<Props> = ({
    maintenanceModeEnabled,
    maintenancePage,
    isLoading,
    loadPageByType,
    shellContext: { isInShell },
    children,
}) => {
    useEffect(() => {
        if (maintenanceModeEnabled && !isLoading && !maintenancePage) {
            loadPageByType("MaintenancePage");
        }
    }, []);

    if (!maintenanceModeEnabled || isInShell) {
        return <>{children}</>;
    }

    if (!maintenancePage) {
        return null;
    }

    return (
        <ShellContext.Provider value={{ isInShell, pageId: maintenancePage.id }}>
            {createPageElement(maintenancePage.type, maintenancePage)}
        </ShellContext.Provider>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(Maintenance));
