import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import AxiomIcon from "@insite/shell/Components/Icons/AxiomIcon";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import shellTheme from "@insite/shell/ShellTheme";
import * as React from "react";

type OwnProps = {
    targetStageMode: DeviceType;
    disabled?: boolean;
    currentStageMode: DeviceType;
    changeStageMode: (stageMode: DeviceType) => void;
};

type Props = OwnProps;

class ViewPortClicker extends React.Component<Props> {
    onClick = () => {
        const { changeStageMode, targetStageMode } = this.props;
        changeStageMode(targetStageMode);
    };

    render() {
        const { currentStageMode, disabled, targetStageMode } = this.props;
        const targetMatchesCurrentStageMode = currentStageMode === targetStageMode;

        const {
            colors: { common, text },
        } = shellTheme;

        let iconColor: string;

        if (disabled) {
            iconColor = common.disabled;
        } else {
            iconColor = text.main;
        }

        const icon = targetStageMode === "Phone" ? "mobile" : targetStageMode === "Tablet" ? "tablet" : "display";

        return (
            <ClickerStyle
                active={targetMatchesCurrentStageMode}
                clickable={!targetMatchesCurrentStageMode}
                onClick={this.onClick}
                disabled={disabled}
                title={`${targetStageMode} Preview`}
            >
                <AxiomIcon src={icon} color={iconColor} size={20} />
            </ClickerStyle>
        );
    }
}

export default ViewPortClicker;
