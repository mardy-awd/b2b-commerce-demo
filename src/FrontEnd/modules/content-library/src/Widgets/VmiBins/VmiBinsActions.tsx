import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import removeVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/RemoveVmiBins";
import { VmiBinsDataViewContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import exportVmiProducts from "@insite/client-framework/Store/Pages/VmiBins/Handlers/ExportVmiProducts";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { BinsPageContext } from "@insite/content-library/Pages/VmiBinsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    return {
        getVmiBinsParameter: state.pages.vmiBins.getVmiBinsParameter,
        selectedIds: state.pages.vmiBins.selectedVmiBins,
        isRemoving: state.data.vmiBins.isRemoving,
    };
};

const mapDispatchToProps = {
    removeVmiBins,
    exportVmiProducts,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface VmiBinsActionsStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    removeLink?: LinkPresentationProps;
    exportLink?: LinkPresentationProps;
    binsCountText?: TypographyPresentationProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const vmiBinsActionsStyles: VmiBinsActionsStyles = {
    container: {
        gap: 8,
        css: css`
            padding: 20px 0;
        `,
    },
    gridItem: {
        width: 12,
        css: css`
            > * {
                padding-right: 10px;
            }
        `,
    },
    twoButtonModalStyles: {
        submitButton: {
            color: "primary",
        },
    },
    removeLink: {
        css: css`
            margin-left: 15px;
        `,
    },
    exportLink: {
        css: css`
            margin-left: 15px;
        `,
    },
};
const styles = vmiBinsActionsStyles;

const VmiBinsActions = ({ getVmiBinsParameter, selectedIds, removeVmiBins, exportVmiProducts, isRemoving }: Props) => {
    const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);

    const vmiBinsDataView = useContext(VmiBinsDataViewContext);

    if (!vmiBinsDataView.value || !vmiBinsDataView.pagination) {
        return null;
    }

    const { totalItemCount } = vmiBinsDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const handleRemoveButtonClick = () => {
        setRemoveModalIsOpen(true);
    };

    const handleExportSelectedButtonClick = () => {
        exportVmiProducts({ ids: selectedIds });
    };

    const handleExportAllButtonClick = () => {
        exportVmiProducts({ ids: {} });
    };

    const handleCancelModalButtonClick = () => {
        setRemoveModalIsOpen(false);
    };

    const handleDeleteModalButtonClick = () => {
        if (!getVmiBinsParameter.vmiLocationId) {
            return;
        }

        setRemoveModalIsOpen(false);
        removeVmiBins({
            vmiLocationId: getVmiBinsParameter.vmiLocationId,
            ids: Object.keys(selectedIds),
        });
    };

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.gridItem}>
                    <Typography {...styles.binsCountText}>
                        {totalItemCount} {translate("Products")}
                    </Typography>
                    <Link
                        {...styles.removeLink}
                        disabled={isRemoving || Object.keys(selectedIds).length === 0}
                        onClick={handleRemoveButtonClick}
                    >
                        {translate("Remove")}
                    </Link>
                    <Link
                        {...styles.exportLink}
                        disabled={isRemoving || Object.keys(selectedIds).length === 0}
                        onClick={handleExportSelectedButtonClick}
                    >
                        {translate("Export Selected")}
                    </Link>
                    <Link {...styles.exportLink} disabled={isRemoving} onClick={handleExportAllButtonClick}>
                        {translate("Export All")}
                    </Link>
                </GridItem>
            </GridContainer>
            <TwoButtonModal
                modalIsOpen={removeModalIsOpen}
                headlineText={translate("Delete Product")}
                messageText={translate("This will delete all information assigned to this product")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={handleCancelModalButtonClick}
                onSubmit={handleDeleteModalButtonClick}
            ></TwoButtonModal>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinsActions),
    definition: {
        group: "VMI Bins",
        allowedContexts: [BinsPageContext],
    },
};

export default widgetModule;
