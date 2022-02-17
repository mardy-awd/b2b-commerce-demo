import toggleFiltersOpen from "@insite/client-framework/Store/Pages/VmiBins/Handlers/ToggleFiltersOpen";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import VmiAddProductModal from "@insite/content-library/Components/VmiAddProductModal";
import VmiBinsImportModal from "@insite/content-library/Components/VmiBinsImportModal";
import { BinsPageContext } from "@insite/content-library/Pages/VmiBinsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiLocationsHeaderStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addProductButton?: ButtonPresentationProps;
    container?: GridContainerProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: VmiLocationsHeaderStyles = {
    titleGridItem: {
        width: [11, 9, 7, 5, 6],
    },
    buttonsGridItem: {
        width: [1, 3, 5, 7, 6],
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    titleText: {
        variant: "h2",
    },
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    toggleFilterGridItem: {
        width: 12,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = headerStyles;

class VmiBinsHeader extends Component<Props, { isAddProductModalOpen: boolean }> {
    state = {
        isAddProductModalOpen: false,
    };

    addProductClickHandler = () => {
        this.setState({ isAddProductModalOpen: true });
    };

    onSuccessAddProductModal = () => {
        this.setState({ isAddProductModalOpen: false });
    };

    onCloseAddProductModal = () => {
        this.setState({ isAddProductModalOpen: false });
    };

    render() {
        return (
            <>
                <GridContainer {...styles.gridContainer}>
                    <GridItem {...styles.titleGridItem}>
                        <Typography as="h2" {...styles.titleText}>
                            {translate("Products")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        <Hidden above="sm">
                            <OverflowMenu position="end" {...styles.overflowMenu}>
                                <Clickable onClick={this.addProductClickHandler}>{translate("Add Product")}</Clickable>
                            </OverflowMenu>
                        </Hidden>
                        <Hidden below="md">
                            <Button {...styles.addProductButton} onClick={this.addProductClickHandler}>
                                {translate("Add Product")}
                            </Button>
                        </Hidden>
                    </GridItem>
                </GridContainer>
                <GridContainer {...styles.container}>
                    <GridItem {...styles.toggleFilterGridItem}>
                        <Clickable onClick={this.props.toggleFiltersOpen}>
                            <Icon src={Filter} {...styles.toggleFilterIcon} />
                        </Clickable>
                    </GridItem>
                </GridContainer>
                <VmiAddProductModal
                    isOpen={this.state.isAddProductModalOpen}
                    onSuccess={this.onSuccessAddProductModal}
                    onClose={this.onCloseAddProductModal}
                />
                <VmiBinsImportModal />
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(VmiBinsHeader),
    definition: {
        group: "VMI Bins",
        allowedContexts: [BinsPageContext],
    },
};

export default widgetModule;
