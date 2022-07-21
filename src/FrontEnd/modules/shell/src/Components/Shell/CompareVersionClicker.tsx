import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import shellTheme from "@insite/shell/ShellTheme";
import { configureComparison } from "@insite/shell/Store/CompareModal/CompareModalActionCreators";
import { loadPublishInfo } from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

type OwnProps = { disabled?: boolean };

const mapStateToProps = (state: ShellState) => {
    const {
        shellContext: { stageMode, currentLanguageId, currentPersonaId, currentDeviceType },
    } = state;

    const page = getCurrentPage(state);

    return {
        page,
        currentLanguageId,
        currentPersonaId,
        currentDeviceType,
        stageMode,
    };
};
const mapDispatchToProps = {
    loadPublishInfo,
    configureComparison,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const CompareVersionClicker = ({
    disabled,
    page,
    currentLanguageId,
    currentPersonaId,
    currentDeviceType,
    stageMode,
    loadPublishInfo,
    configureComparison,
}: Props) => {
    useEffect(() => {
        if (!page?.id) {
            return;
        }

        loadPublishInfo(page.id);
    }, [page.id]);

    return (
        <ClickerStyle
            data-test-selector="contentModeClicker_CompareVersion"
            title="Compare"
            clickable
            disabled={disabled}
            onClick={() => {
                configureComparison({
                    languageId: currentLanguageId,
                    personaId: currentPersonaId,
                    deviceType: currentDeviceType,
                    stageMode,
                    pageId: page.id,
                    name: page.name,
                    canSelectVersion: true,
                });
            }}
        >
            <AxiomIcon size={20} color={shellTheme.colors.text.main} src="exchange" />
        </ClickerStyle>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareVersionClicker);
