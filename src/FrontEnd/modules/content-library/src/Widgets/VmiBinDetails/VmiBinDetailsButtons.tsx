import { VmiBinStateContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import VmiAddProductModal from "@insite/content-library/Components/VmiAddProductModal";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import React, { useContext, useState } from "react";
import { css } from "styled-components";

export interface VmiBinDetailsButtonsStyles {
    gridContainer?: GridContainerProps;
    buttonsGridItem?: GridItemProps;
    overflowMenu?: OverflowMenuPresentationProps;
}

export const vmiBinDetailsButtonsStyles: VmiBinDetailsButtonsStyles = {
    buttonsGridItem: {
        width: [6, 6, 6, 12, 12],
        css: css`
            display: flex;
            justify-content: flex-end;
            nav {
                display: inline-block;
            }
        `,
    },
};

const styles = vmiBinDetailsButtonsStyles;

const VmiBinDetailsButtons = () => {
    const [editProductModalOpen, setEditProductModalOpen] = useState(false);

    const { value: vmiBin } = useContext(VmiBinStateContext);
    if (!vmiBin) {
        return null;
    }

    const editProductBinClickHandler = () => {
        setEditProductModalOpen(true);
    };

    const onSuccessEditProductModal = () => {
        setEditProductModalOpen(false);
    };

    const onCloseEditProductModal = () => {
        setEditProductModalOpen(false);
    };

    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.buttonsGridItem}>
                    <OverflowMenu position="end" {...styles.overflowMenu}>
                        <Clickable onClick={editProductBinClickHandler}>{translate("Edit Product/Bin")}</Clickable>
                    </OverflowMenu>
                </GridItem>
            </GridContainer>
            <VmiAddProductModal
                vmiBinId={vmiBin.id}
                isOpen={editProductModalOpen}
                onSuccess={onSuccessEditProductModal}
                onClose={onCloseEditProductModal}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: VmiBinDetailsButtons,
    definition: {
        group: "VMI Bin Details",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
