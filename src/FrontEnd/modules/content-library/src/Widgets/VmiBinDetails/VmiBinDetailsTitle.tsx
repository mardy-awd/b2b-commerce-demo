import { VmiBinStateContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { useContext } from "react";

export interface VmiBinDetailsTitleStyles {
    titleText: TypographyPresentationProps;
}

export const titleStyles: VmiBinDetailsTitleStyles = {
    titleText: {
        variant: "h2",
    },
};

const styles = titleStyles;

const VmiBinDetailsTitle: React.FC = () => {
    const { value: vmiBin } = useContext(VmiBinStateContext);
    if (!vmiBin) {
        return null;
    }

    return (
        <Typography as="h1" {...styles.titleText}>
            {vmiBin.product?.shortDescription}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: VmiBinDetailsTitle,
    definition: {
        allowedContexts: ["VmiBinDetailsPage"],
        group: "VMI Bin Details",
    },
};

export default widgetModule;
