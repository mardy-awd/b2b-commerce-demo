import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getVmiLocationsDataView } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/VmiBins/Handlers/ToggleFiltersOpen";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBins/Handlers/UpdateSearchFields";
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
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const getVmiLocationsParameter = {
        ...state.pages.vmiLocations.getVmiLocationsParameter,
        page: 1,
        pageSize: 9999, // need to get all locations
    };

    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationid?: string }>(location.search?.toLowerCase());

    return {
        vmiLocationsDataView: getVmiLocationsDataView(state, getVmiLocationsParameter),
        vmiBinsPageUrl: getPageLinkByPageType(state, "VmiBinsPage")?.url,
        vmiLocationId: state.pages.vmiBins.getVmiBinsParameter.vmiLocationId,
        parsedQuery,
    };
};

const mapDispatchToProps = {
    toggleFiltersOpen,
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface VmiLocationsHeaderStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addProductButton?: ButtonPresentationProps;
    container?: GridContainerProps;
    locationSwitcherGridItem?: GridItemProps;
    locationSelect?: SelectPresentationProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: VmiLocationsHeaderStyles = {
    centeringWrapper: {
        css: css`
            height: 100px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
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
    locationSwitcherGridItem: {
        width: [12, 12, 11, 11, 11],
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    locationSelect: {
        cssOverrides: {
            formInputWrapper: css`
                width: 200px;
                align-self: end;
            `,
            inputSelect: css`
                text-transform: uppercase;
            `,
        },
    },
    toggleFilterGridItem: {
        width: [12, 12, 1, 1, 1],
        style: { marginTop: "8px", justifyContent: "flex-end", alignSelf: "center" },
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

    onSuccessAddProductModal = () => {};

    onCloseAddProductModal = () => {
        this.setState({ isAddProductModalOpen: false });
    };

    setLocation = (locationId: string) => {
        if (this.props.vmiBinsPageUrl) {
            this.props.history.push(`${this.props.vmiBinsPageUrl}${locationId ? `?locationId=${locationId}` : ""}`);
            if (!locationId) {
                this.props.updateSearchFields({ vmiLocationId: undefined });
            }
        }
    };

    render() {
        if (!this.props.vmiLocationsDataView.value || this.props.vmiLocationsDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        const vmiLocations = this.props.vmiLocationsDataView;
        let currentLocation = null;
        if (vmiLocations?.value && vmiLocations.value.length > 0) {
            const locationId = this.props.parsedQuery?.locationid?.toLowerCase() || this.props.vmiLocationId;
            currentLocation = locationId
                ? vmiLocations.value.find(location => location.id?.toLowerCase() === locationId)
                : null;
        }

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
                    {vmiLocations && vmiLocations.value && (
                        <GridItem {...styles.locationSwitcherGridItem}>
                            <Select
                                {...styles.locationSelect}
                                data-test-selector="locationSelector"
                                onChange={event => this.setLocation(event.currentTarget.value)}
                                value={currentLocation?.id ?? ""}
                                hasLabel
                            >
                                <option value="">{translate("Select Location")}</option>
                                {vmiLocations.value.map(c => (
                                    <option value={c.id} key={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                    )}
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
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(VmiBinsHeader)),
    definition: {
        group: "VMI Bins",
        allowedContexts: [BinsPageContext],
    },
};

export default widgetModule;
