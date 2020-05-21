import * as React from "react";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import TextField from "@insite/mobius/TextField";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import ConfigMenu, { configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";

const undefinedIfFunction = (value: string | undefined | Function) => typeof value === "function" ? undefined : value;

const IconConfig: React.FunctionComponent<{
    idPrefix: string;
    iconProps: IconPresentationProps;
    getProps: (draft: BaseTheme) => IconPresentationProps;
    disableSource?: true;
    insideForm?: boolean;
    title?: string;
    variant?: "accordion" | "popover";
} & PresetHelpers> = ({
    idPrefix,
    iconProps,
    getProps,
    disableSource,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    presetColors,
    title,
    insideForm,
    variant,
}) => {
    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;

    return (
    <ConfigWrapper
        title={title || "Icon Configuration"}
        insideForm={insideForm}
        inPopover={variant === "accordion"}
    >
        <ColorPicker
            label="Color"
            isInPopover
            id={`${idPrefix}-icon-color`}
            color={tryMatchColorStringToPresetValue(iconProps.color)}
            onChange={color => update(draft => {
                getProps(draft).color = tryMatchColorResultToPresetName(color);
            })}
            presetColors={presetColors}
        />
        {!disableSource && <IconSelector
            {...configFormFieldStyles}
            label="Icon"
            value={undefinedIfFunction(iconProps.src)}
            onTextFieldChange={event => update(draft => {
                const props = getProps(draft);

                if (!event.currentTarget.value) {
                    delete props.src;
                } else {
                    props.src = event.currentTarget.value;
                }
            })}
            onSelectionChange={value => update(draft => {
                const props = getProps(draft);

                if (!value) {
                    delete props.src;
                } else {
                    props.src = value;
                }
            })}
        />}
        <TextField
            {...configFormFieldStyles}
            label="Size"
            value={iconProps.size}
            onChange={event => update(draft => {
                const props = getProps(draft);

                if (!event.currentTarget.value) {
                    delete props.size;
                } else {
                    props.size = parseInt(event.currentTarget.value, 10);
                }
            })}
        />
    </ConfigWrapper>
    );
};

export default IconConfig;
