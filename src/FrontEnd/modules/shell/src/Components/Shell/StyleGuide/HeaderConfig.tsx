import Tab, { TabProps } from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import TextField from "@insite/mobius/TextField";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import CheckboxConfig from "@insite/shell/Components/Shell/StyleGuide/CheckboxConfig";
import ColorPickerConfig from "@insite/shell/Components/Shell/StyleGuide/ColorPickerConfig";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import SelectConfig from "@insite/shell/Components/Shell/StyleGuide/SelectConfig";
import {
    configHeaderFormFieldStyles,
    configHeaderFormFieldStylesExtraMargin,
} from "@insite/shell/Components/Shell/StyleGuide/Styles";
import React from "react";
import { css } from "styled-components";

const tabGroupCssOverrides = {
    wrapper: css`
        padding: 0;
    `,
    tabContent: css`
        border: none;
        padding: 10px 0 0 0;
    `,
};

const tabCss = css`
    padding: 4px;
    border-bottom: 2px solid ${({ selected }: TabProps) => (selected ? getColor("custom.activeBorder") : "transparent")};
    &:hover {
        border-bottom: 2px solid ${getColor("custom.activeBorder")};
        cursor: pointer;
    }

    && {
        outline: none;
    }
`;

const CompactHeader = (props: any) => {
    const { triggerPoint, borderThickness, isCompactHeader, isDropShadow, isBorder } =
        props?.presetHelpers?.theme?.header;

    return (
        <ConfigMenu title="Compact Header" insideForm={false}>
            <CheckboxConfig
                locationInTheme="header.isCompactHeader"
                title="Enable Compact Header"
                {...props.presetHelpers}
            />
            <Typography
                as="h2"
                css={css`
                    font-size: 20px;
                    font-weight: 500;
                    margin: 0;
                `}
            >
                Compact Header Styles
            </Typography>
            {isCompactHeader && (
                <TabGroup current="general" cssOverrides={tabGroupCssOverrides}>
                    <Tab headline="General" tabKey="general" css={tabCss}>
                        <TextField
                            label="Compact Header Trigger Point (px)"
                            value={triggerPoint}
                            onChange={(e: any) => {
                                const { update } = props.presetHelpers;
                                update((draft: any) => {
                                    if (e.target.value === "") {
                                        draft.header.triggerPoint = e.target.value;
                                        return;
                                    }
                                    const newVal = parseInt(e.target.value, 10);
                                    // eslint-disable-next-line no-restricted-globals
                                    if (isNaN(newVal)) {
                                        return;
                                    }
                                    draft.header.triggerPoint = newVal;
                                });
                            }}
                            {...configHeaderFormFieldStylesExtraMargin}
                        />
                        <ColorPickerConfig
                            firstInput
                            locationInTheme="header.backgroundColor"
                            title="Background Color"
                            id="header-background-color"
                            {...props.presetHelpers}
                        />
                        <ColorPickerConfig
                            firstInput
                            locationInTheme="header.linkColor"
                            title="Link Color"
                            id="header-link-color"
                            {...props.presetHelpers}
                        />
                    </Tab>
                    <Tab headline="Drop Shadow" tabKey="dropShadow" css={tabCss}>
                        <CheckboxConfig
                            locationInTheme="header.isDropShadow"
                            title="Enable Drop Shadow"
                            {...props.presetHelpers}
                        />

                        {isDropShadow && (
                            <>
                                <SelectConfig
                                    title="Shadow Style"
                                    locationInTheme="header.dropShadowStyle"
                                    {...props.presetHelpers}
                                    css={css`
                                        &&& {
                                            border-radius: 3px;
                                        }
                                    `}
                                >
                                    <option value="" hidden disabled></option>
                                    <option value="light">Light</option>
                                    <option value="medium">Medium</option>
                                    <option value="dark">Dark</option>
                                </SelectConfig>
                            </>
                        )}
                    </Tab>
                    <Tab headline="Border" tabKey="border" css={tabCss}>
                        <CheckboxConfig
                            locationInTheme="header.isBorder"
                            title="Enable Border"
                            {...props.presetHelpers}
                        />
                        {isBorder && (
                            <>
                                <ColorPickerConfig
                                    firstInput
                                    locationInTheme="header.borderColor"
                                    title="Color"
                                    id="header-border-color"
                                    {...props.presetHelpers}
                                />
                                <TextField
                                    label="Thickness (px)"
                                    value={borderThickness}
                                    onChange={(e: any) => {
                                        const { update } = props.presetHelpers;
                                        update((draft: any) => {
                                            if (e.target.value === "") {
                                                draft.header.borderThickness = e.target.value;
                                                return;
                                            }
                                            const newVal = parseInt(e.target.value, 10);
                                            // eslint-disable-next-line no-restricted-globals
                                            if (isNaN(newVal)) {
                                                return;
                                            }
                                            draft.header.borderThickness = newVal;
                                        });
                                    }}
                                    {...configHeaderFormFieldStyles}
                                />
                                <Typography as="p" weight={600}>
                                    Border Location
                                </Typography>
                                <CheckboxConfig
                                    locationInTheme="header.isBorderTop"
                                    title="Top"
                                    {...props.presetHelpers}
                                />
                                <CheckboxConfig
                                    locationInTheme="header.isBorderRight"
                                    title="Right"
                                    {...props.presetHelpers}
                                />
                                <CheckboxConfig
                                    locationInTheme="header.isBorderBottom"
                                    title="Bottom"
                                    {...props.presetHelpers}
                                />
                                <CheckboxConfig
                                    locationInTheme="header.isBorderLeft"
                                    title="Left"
                                    {...props.presetHelpers}
                                />
                            </>
                        )}
                    </Tab>
                </TabGroup>
            )}
        </ConfigMenu>
    );
};

export default function HeaderConfig(props: any) {
    return <CompactHeader {...props} />;
}
