import Zone from "@insite/client-framework/Components/Zone";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiBinDetails/VmiBinDetailsReducer";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Tab, { TabPresentationProps } from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import * as React from "react";
import { useState } from "react";
import { css } from "styled-components";

type Props = WidgetProps;

export interface VmiBinDetailsTabbedTableStyles {
    tabContainer?: TabPresentationProps;
}

export const vmiBinDetailsTabbedTableStyles: VmiBinDetailsTabbedTableStyles = {
    tabContainer: {
        css: css`
            text-transform: capitalize;
        `,
    },
};

const styles = vmiBinDetailsTabbedTableStyles;

const VmiBinDetailsTabbedTable = ({ id }: Props) => {
    const [currentTab, setCurrentTab] = useState(TableTabKeys.PreviousCounts);

    const onTabChange = (event: React.MouseEvent | React.KeyboardEvent, tabKey?: string) => {
        if (tabKey) {
            setCurrentTab(tabKey as TableTabKeys);
        }
    };

    return (
        <TabGroup current={currentTab} onTabChange={onTabChange}>
            <Tab
                {...styles.tabContainer}
                headline={translate("Previous Counts")}
                key={TableTabKeys.PreviousCounts}
                tabKey={TableTabKeys.PreviousCounts}
            >
                <Zone zoneName="Counts" contentId={id} />
            </Tab>
            <Tab
                {...styles.tabContainer}
                // eslint-disable-next-line spire/avoid-dynamic-translate
                headline={translate("Previous Orders")}
                key={TableTabKeys.PreviousOrders}
                tabKey={TableTabKeys.PreviousOrders}
            >
                <Zone zoneName="Orders" contentId={id} />
            </Tab>
        </TabGroup>
    );
};

const widgetModule: WidgetModule = {
    component: VmiBinDetailsTabbedTable,
    definition: {
        group: "VMI Bin Details",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
