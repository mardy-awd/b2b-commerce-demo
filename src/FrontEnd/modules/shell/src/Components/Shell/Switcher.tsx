import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import CompareVersionClicker from "@insite/shell/Components/Shell/CompareVersionClicker";
import ContentModeClicker from "@insite/shell/Components/Shell/ContentModeClicker";
import HeaderGear from "@insite/shell/Components/Shell/HeaderGear";
import ViewPortClicker from "@insite/shell/Components/Shell/ViewPortClicker";
import { changeStageMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = ({ shellContext: { mobileCmsModeActive, stageMode, contentMode } }: ShellState) => ({
    mobileCmsModeActive,
    stageMode,
    contentMode,
});

const mapDispatchToProps = {
    changeStageMode,
};

type Props = { disabled?: boolean } & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const Switcher: React.FC<Props> = ({ disabled, mobileCmsModeActive, stageMode, contentMode, changeStageMode }) => {
    const clicker = (targetStageMode: DeviceType) => (
        <ViewPortClicker
            targetStageMode={targetStageMode}
            disabled={disabled}
            currentStageMode={stageMode}
            changeStageMode={changeStageMode}
        />
    );

    return (
        <SwitcherStyle>
            {mobileCmsModeActive && (
                <>
                    <StyledA
                        target="_blank"
                        href="https://support.insitesoft.com/hc/en-us/articles/360038606591-Use-the-Mobile-App-CMS"
                    >
                        How To Preview Changes
                    </StyledA>
                    <AxiomIcon
                        src="pipe"
                        size={16}
                        css={pipeCss}
                        color={disabled ? "common.disabled" : "custom.borderDividerColor"}
                    />
                </>
            )}
            {contentMode === "Editing" && <CompareVersionClicker disabled={disabled} />}
            <ContentModeClicker targetContentMode="Editing" icon="pen" disabled={disabled} />
            <ContentModeClicker targetContentMode="Previewing" icon="eye" disabled={disabled} />
            {!mobileCmsModeActive && (
                <>
                    <AxiomIcon
                        src="pipe"
                        size={16}
                        css={pipeCss}
                        color={disabled ? "common.disabled" : "custom.borderDividerColor"}
                    />
                    <div style={{ height: "100%" }} data-test-selector="preview_switcher">
                        {clicker("Phone")}
                        {clicker("Tablet")}
                        {clicker("Desktop")}
                    </div>
                </>
            )}
            <AxiomIcon
                src="pipe"
                size={16}
                css={pipeCss}
                color={disabled ? "common.disabled" : "custom.borderDividerColor"}
            />
            <HeaderGear />
        </SwitcherStyle>
    );
};

const pipeCss = css`
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SwitcherStyle = styled.div`
    display: flex;
    align-items: center;
    margin: 0 30px 0 auto;

    @media (max-width: 1100px) {
        margin-left: 0;
    }
`;

const StyledA = styled.a`
    color: #09f;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
`;

export default connect(mapStateToProps, mapDispatchToProps)(Switcher);
