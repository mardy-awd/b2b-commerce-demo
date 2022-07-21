import { setCookie } from "@insite/client-framework/Common/Cookies";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setInitialValues from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetInitialValues";
import setNavDrawerIsOpen from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetNavDrawerIsOpen";
import {
    getCurrencies,
    getFulfillmentLabel,
    getIsPunchOutSession,
    getLanguages,
    getSettingsCollection,
} from "@insite/client-framework/Store/Context/ContextSelectors";
import cancelPunchOut from "@insite/client-framework/Store/Context/Handlers/CancelPunchOut";
import setCurrency from "@insite/client-framework/Store/Context/Handlers/SetCurrency";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import signOut from "@insite/client-framework/Store/Context/Handlers/SignOut";
import { getHeader, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWidgetsByPageId } from "@insite/client-framework/Store/Data/Widgets/WidgetSelectors";
import { getPageLinkByPageType, LinkModel, useGetLinks } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { NavigationModeCookieName } from "@insite/content-library/Components/NavigationModeMenu";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import Drawer, { DrawerPresentationProps } from "@insite/mobius/Drawer";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Globe from "@insite/mobius/Icons/Globe";
import MapPin from "@insite/mobius/Icons/MapPin";
import Menu from "@insite/mobius/Icons/Menu";
import { MappedLink } from "@insite/mobius/Menu";
import PanelMenu, { PanelMenuPresentationProps } from "@insite/mobius/PanelMenu";
import PanelRow, { PanelRowPresentationProps } from "@insite/mobius/PanelMenu/PanelRow";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const headerLinkListLinkFields =
        (getWidgetsByPageId(state, getHeader(state).id).find((widget: WidgetProps) => {
            return widget.type === "Header/HeaderLinkList";
        })?.fields.links as LinkModel[]) ?? [];

    return {
        currencies: getCurrencies(state),
        currentCurrencyId: state.context.session.currency?.id,
        currentCurrencySymbol: state.context.session.currency?.currencySymbol,
        languages: getLanguages(state),
        currentLanguage: state.context.session.language,
        currentLocation: getLocation(state),
        isSigningIn: state.context.isSigningIn,
        userName: state.context.session?.userName,
        isGuest: state.context.session?.isGuest,
        myAccountPageLink: getPageLinkByPageType(state, "MyAccountPage"),
        signInUrl: getPageLinkByPageType(state, "SignInPage"),
        vmiDashboardPageUrl: getPageLinkByPageType(state, "VmiDashboardPage")?.url,
        homePageUrl: getPageLinkByPageType(state, "HomePage")?.url,
        headerLinkListLinkFields,
        showCustomerMenuItem: getSettingsCollection(state).accountSettings.enableWarehousePickup,
        fulfillmentLabel: getFulfillmentLabel(state),
        drawerIsOpen: state.components.addressDrawer.navDrawerIsOpen,
        isPunchOutSession: getIsPunchOutSession(state),
    };
};

const mapDispatchToProps = {
    setCurrency,
    setLanguage,
    signOut,
    cancelPunchOut,
    setInitialValues,
    setNavDrawerIsOpen,
};

interface OwnProps {
    links: MappedLink[];
    showQuickOrder: boolean;
    quickOrderLink: PageLinkModel | undefined;
    displayVmiNavigation: boolean;
    vmiPageLinks: (PageLinkModel | undefined)[];
    displayModeSwitch?: boolean;
    currentMode?: string;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface NavigationDrawerStyles {
    menuTriggerButton?: ButtonPresentationProps;
    drawer?: DrawerPresentationProps;
    drawerSectionWrapper?: InjectableCss;
    panelMenu?: PanelMenuPresentationProps;
    panelSectionWrapper?: InjectableCss;
    menuRowIcon?: IconProps;
    userRowTypography?: TypographyPresentationProps;
    punchOutUserRowText?: TypographyPresentationProps;
    mainNavigationRow?: PanelRowPresentationProps;
    mainNavigationRowIcon?: IconProps;
    punchOutNavigationRowIcon?: IconProps;
    mainNavigationRowTypography?: TypographyPresentationProps;
    logoLinks?: PanelRowPresentationProps & { typographyProps: TypographyPresentationProps };
    currencySymbol?: TypographyPresentationProps;
    changeCustomerRow?: PanelRowPresentationProps;
    changeCustomerRowContainer?: GridContainerProps;
    fulfillmentMethodGridItem?: GridItemProps;
    addressesGridItem?: GridItemProps;
    pickUpAddressGridItem?: GridItemProps;
    applyButtonGridItem?: GridItemProps;
    signOutRow?: PanelRowPresentationProps;
    signOutRowText?: TypographyPresentationProps;
}

const StyledSection = getStyledWrapper("section");
const StyledSpan = getStyledWrapper("span");

export const navigationDrawerStyles: NavigationDrawerStyles = {
    menuTriggerButton: {
        shape: "pill",
        color: "secondary",
        size: 50,
    },
    drawer: {
        size: 300,
        cssOverrides: {
            drawerContent: css`
                margin-top: -2px;
                overflow-x: hidden;
            `,
        },
    },
    drawerSectionWrapper: {
        css: css`
            &:first-child {
                margin-top: 0;
                padding-bottom: 10px;
                background: ${getColor("common.backgroundContrast")};
            }
            &:last-child {
                margin-bottom: 5px;
            }
            margin-top: 20px;
        `,
    },
    panelMenu: {
        cssOverrides: {
            wrapper: css`
                > button {
                    width: calc(100% - 2px);
                }
            `,
        },
    },
    panelSectionWrapper: {
        css: css`
            height: 22px;
            display: flex;
            align-items: center;
        `,
    },
    menuRowIcon: {
        size: 22,
        css: css`
            margin-top: -2px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    userRowTypography: {
        transform: "uppercase",
        color: "common.background",
    },
    punchOutUserRowText: {
        transform: "uppercase",
        color: "common.background",
    },
    mainNavigationRow: {
        color: "common.backgroundContrast",
        css: css`
            margin: 2px;
        `,
    },
    mainNavigationRowIcon: {
        src: "User",
        color: "common.background",
        size: 22,
        css: css`
            margin-top: -2px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    punchOutNavigationRowIcon: {
        src: "User",
        color: "common.background",
        size: 22,
        css: css`
            margin-top: -2px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    mainNavigationRowTypography: {
        transform: "uppercase",
        color: "common.background",
        weight: "bold",
    },
    logoLinks: {
        color: "common.accent",
        typographyProps: {
            ellipsis: true,
            transform: "uppercase",
        },
        css: css`
            margin: 2px;
        `,
    },
    currencySymbol: {
        size: 22,
        css: css`
            margin-top: -4px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    changeCustomerRow: {
        css: css`
            &:focus {
                outline: none;
            }
        `,
    },
    changeCustomerRowContainer: { gap: 15 },
    fulfillmentMethodGridItem: { width: 12 },
    addressesGridItem: { width: 12 },
    pickUpAddressGridItem: { width: 12 },
    applyButtonGridItem: { width: 12 },
    signOutRowText: {
        transform: "uppercase",
    },
};

const styles = navigationDrawerStyles;

const NavigationDrawer: FC<Props> = props => {
    const headerLinkListLinks = useGetLinks(props.headerLinkListLinkFields, o => o.fields.destination);
    const openDrawer = () => {
        props.setNavDrawerIsOpen({ navDrawerIsOpen: true });
        props.setInitialValues({});
    };

    const closeDrawer = () => {
        props.setNavDrawerIsOpen({ navDrawerIsOpen: false });
        setTimeout(() => props.setNavDrawerIsOpen({ navDrawerIsOpen: undefined }), 300);
    };

    const onSignOutHandler = () => {
        props.setNavDrawerIsOpen({ navDrawerIsOpen: false });
        props.isPunchOutSession ? props.cancelPunchOut() : props.signOut();
    };

    const navigationModeChangeHandler = (navigationMode: "Storefront" | "Vmi") => {
        setCookie(NavigationModeCookieName, navigationMode);
        if (navigationMode === "Vmi") {
            props.vmiDashboardPageUrl && history.push(props.vmiDashboardPageUrl);
        } else {
            props.homePageUrl && history.push(props.homePageUrl);
        }
    };

    const {
        quickOrderLink,
        links,
        showQuickOrder,
        currencies,
        currentCurrencyId,
        currentCurrencySymbol,
        languages,
        currentLanguage,
        setLanguage,
        setCurrency,
        userName,
        isGuest,
        myAccountPageLink,
        signInUrl,
        currentLocation,
        showCustomerMenuItem,
        fulfillmentLabel,
        isPunchOutSession,
        headerLinkListLinkFields,
        history,
        displayVmiNavigation,
        displayModeSwitch,
        currentMode,
        vmiPageLinks,
    } = props;

    const currentPageUrl = currentLocation.pathname;

    return (
        <>
            <Button
                className="menu-trigger-button"
                onClick={openDrawer}
                {...styles.menuTriggerButton}
                data-test-selector="expandMobileMenu"
            >
                <ButtonIcon className="menu-trigger-button-icon" src={Menu} />
                <VisuallyHidden>{translate("menu")}</VisuallyHidden>
            </Button>
            <Drawer
                className="drawer"
                draggable
                position="left"
                {...styles.drawer}
                isOpen={props.drawerIsOpen}
                handleClose={closeDrawer}
                contentLabel="menu drawer"
            >
                <StyledSection className="drawer-section-wrapper" {...styles.drawerSectionWrapper}>
                    {userName && !isGuest && !isPunchOutSession ? (
                        <PanelMenu
                            className="panel-menu"
                            currentUrl={currentPageUrl}
                            panelTrigger={
                                <PanelRow className="main-navigation-row" hasChildren {...styles.mainNavigationRow}>
                                    <StyledSpan className="panel-section-wrapper" {...styles.panelSectionWrapper}>
                                        <Icon className="main-navigation-row-icon" {...styles.mainNavigationRowIcon} />
                                        <Typography className="user-row-text" {...styles.userRowTypography}>
                                            {userName}
                                        </Typography>
                                    </StyledSpan>
                                </PanelRow>
                            }
                            menuItems={myAccountPageLink?.children ? myAccountPageLink?.children : []}
                            maxDepth={3}
                            closeOverlay={closeDrawer}
                            layer={0}
                            {...styles.panelMenu}
                        />
                    ) : isPunchOutSession ? (
                        <PanelRow className="main-navigation-row" {...styles.mainNavigationRow}>
                            <StyledSpan className="panel-section-wrapper" {...styles.panelSectionWrapper}>
                                <Icon className="punch-out-navigation-row-icon" {...styles.punchOutNavigationRowIcon} />
                                <Typography className="punch-out-user-row-text" {...styles.punchOutUserRowText}>
                                    {userName}
                                </Typography>
                            </StyledSpan>
                        </PanelRow>
                    ) : (
                        <PanelRow
                            className="main-navigation-row"
                            {...styles.mainNavigationRow}
                            isCurrent={currentPageUrl === signInUrl?.url}
                            onClick={closeDrawer}
                            onKeyPress={(event: React.KeyboardEvent) => {
                                if (event.key === " " && history && signInUrl?.url) {
                                    event.preventDefault();
                                    closeDrawer();
                                    history.push(signInUrl.url);
                                }
                            }}
                            href={signInUrl?.url}
                        >
                            <StyledSpan className="panel-section-wrapper" {...styles.panelSectionWrapper}>
                                <Icon className="main-navigation-row-icon" {...styles.mainNavigationRowIcon} />
                                <Typography className="user-row-text" {...styles.userRowTypography}>
                                    {translate("Sign In")}
                                </Typography>
                            </StyledSpan>
                        </PanelRow>
                    )}
                    {/* covers MainNavigation functionality */}
                    {!displayVmiNavigation &&
                        links.map((link, index) => {
                            if (link.children && link.children.length > 0) {
                                return (
                                    <PanelMenu
                                        className="panel-menu"
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        currentUrl={currentPageUrl}
                                        closeOverlay={closeDrawer}
                                        panelTrigger={
                                            <PanelRow
                                                className="main-navigation-row"
                                                hasChildren
                                                {...styles.mainNavigationRow}
                                            >
                                                <Typography
                                                    className="main-navigation-row-text"
                                                    {...styles.mainNavigationRowTypography}
                                                >
                                                    {link.title}
                                                </Typography>
                                            </PanelRow>
                                        }
                                        menuItems={link.children}
                                        maxDepth={link.maxDepth || 3}
                                        layer={0}
                                        {...styles.panelMenu}
                                    />
                                );
                            }
                            return (
                                <PanelRow
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    href={link.url}
                                    target={link.openInNewWindow ? "_blank" : ""}
                                    className="main-navigation-row"
                                    {...styles.mainNavigationRow}
                                >
                                    <Typography
                                        className="main-navigation-row-text"
                                        {...styles.mainNavigationRowTypography}
                                    >
                                        {link.title}
                                    </Typography>
                                </PanelRow>
                            );
                        })}
                    {!displayVmiNavigation && showQuickOrder && quickOrderLink && (
                        <PanelRow
                            className="main-navigation-row"
                            isCurrent={currentPageUrl === quickOrderLink.url}
                            onClick={closeDrawer}
                            href={quickOrderLink.url}
                            {...styles.mainNavigationRow}
                        >
                            <Typography className="main-navigation-row-text" {...styles.mainNavigationRowTypography}>
                                {quickOrderLink.title}
                            </Typography>
                        </PanelRow>
                    )}
                    {displayVmiNavigation &&
                        vmiPageLinks.map(
                            link =>
                                link && (
                                    <PanelRow
                                        className="main-navigation-row"
                                        key={link.id}
                                        isCurrent={currentPageUrl === link.url}
                                        onClick={closeDrawer}
                                        href={link.url}
                                        {...styles.mainNavigationRow}
                                    >
                                        <Typography
                                            className="main-navigation-row-text"
                                            {...styles.mainNavigationRowTypography}
                                        >
                                            {link.title}
                                        </Typography>
                                    </PanelRow>
                                ),
                        )}
                </StyledSection>
                {headerLinkListLinks.length > 0 && (
                    <StyledSection className="drawer-section-wrapper" {...styles.drawerSectionWrapper}>
                        {headerLinkListLinks.map((link, index) => (
                            <PanelRow
                                className="logo-links-row"
                                key={link.title + String(index)}
                                {...(styles.logoLinks && omitSingle(styles.logoLinks, "typographyProps"))}
                                isCurrent={currentPageUrl === link.url}
                                onClick={closeDrawer}
                                onKeyPress={(event: React.KeyboardEvent) => {
                                    if (event.key === " " && history && link?.url) {
                                        event.preventDefault();
                                        closeDrawer();
                                        history.push(link.url);
                                    }
                                }}
                                href={link.url}
                                target={headerLinkListLinkFields[index].fields.openInNewWindow ? "_blank" : ""}
                            >
                                <Typography className="logo-link-title" {...styles.logoLinks?.typographyProps}>
                                    {link.title}
                                </Typography>
                            </PanelRow>
                        ))}
                    </StyledSection>
                )}
                <StyledSection className="drawer-section-wrapper" {...styles.drawerSectionWrapper}>
                    <SelectorMenu
                        options={currencies?.map(c => {
                            return {
                                title: c.currencyCode.toUpperCase(),
                                clickableProps: {
                                    onClick: () => {
                                        setCurrency({ currencyId: c.id });
                                        closeDrawer();
                                    },
                                },
                            };
                        })}
                        closeModal={closeDrawer}
                        currentOption={currencies?.find(c => c.id === currentCurrencyId)?.currencyCode}
                        currentOptionIcon={<Typography {...styles.currencySymbol}>{currentCurrencySymbol}</Typography>}
                    />
                    <SelectorMenu
                        dataTestSelector="mobileLanguageSelector"
                        options={languages?.map(l => {
                            return {
                                title: l.languageCode.toUpperCase(),
                                clickableProps: {
                                    onClick: () => {
                                        setLanguage({ languageId: l.id });
                                        closeDrawer();
                                    },
                                },
                            };
                        })}
                        currentOption={currentLanguage?.languageCode}
                        closeModal={closeDrawer}
                        currentOptionIcon={
                            currentLanguage?.imageFilePath ? (
                                <LogoImage className="language-image" src={currentLanguage.imageFilePath} alt="" />
                            ) : (
                                <Icon className="menu-row-icon" src={Globe} {...styles.menuRowIcon} />
                            )
                        }
                    />
                    {showCustomerMenuItem && (
                        <PanelMenu
                            className="panel-menu"
                            {...styles.panelMenu}
                            panelTrigger={
                                <PanelRow
                                    hasChildren
                                    className="logo-links-row"
                                    {...styles.logoLinks}
                                    color="common.accent"
                                >
                                    <Typography className="logo-link-title" {...styles.logoLinks?.typographyProps}>
                                        <Icon src={MapPin} className="menu-row-icon" {...styles.menuRowIcon} />
                                        {fulfillmentLabel}
                                    </Typography>
                                </PanelRow>
                            }
                            layer={0}
                            closeOverlay={closeDrawer}
                        >
                            {isPunchOutSession ? (
                                <PanelRow tabIndex={-1} className="change-customer-row" {...styles.changeCustomerRow}>
                                    {createWidgetElement("Header/AddressDrawerPunchOutCustomer", {
                                        fields: {},
                                    })}
                                </PanelRow>
                            ) : (
                                <PanelRow tabIndex={-1} className="change-customer-row" {...styles.changeCustomerRow}>
                                    <GridContainer
                                        className="change-customer-row-container"
                                        {...styles.changeCustomerRowContainer}
                                    >
                                        <GridItem
                                            className="fulfillment-method-grid-item"
                                            {...styles.fulfillmentMethodGridItem}
                                        >
                                            {createWidgetElement("Header/AddressDrawerFulfillmentMethodSelector", {
                                                fields: {},
                                            })}
                                        </GridItem>
                                        <GridItem className="addresses-grid-item" {...styles.addressesGridItem}>
                                            {createWidgetElement("Header/AddressDrawerSelectCustomer", {
                                                fields: {},
                                            })}
                                        </GridItem>
                                        <GridItem
                                            className="pick-up-address-grid-item"
                                            {...styles.pickUpAddressGridItem}
                                        >
                                            {createWidgetElement("Header/AddressDrawerPickUpLocationSelector", {
                                                fields: {},
                                            })}
                                        </GridItem>
                                        <GridItem className="apply-button-grid-item" {...styles.applyButtonGridItem}>
                                            {createWidgetElement("Header/AddressDrawerApplyButton", { fields: {} })}
                                        </GridItem>
                                    </GridContainer>
                                </PanelRow>
                            )}
                        </PanelMenu>
                    )}
                    {displayModeSwitch && (
                        <SelectorMenu
                            options={[
                                {
                                    title: translate("Storefront"),
                                    clickableProps: {
                                        onClick: () => {
                                            navigationModeChangeHandler("Storefront");
                                            closeDrawer();
                                        },
                                    },
                                },
                                {
                                    title: translate("Vendor Managed Inventory"),
                                    clickableProps: {
                                        onClick: () => {
                                            navigationModeChangeHandler("Vmi");
                                            closeDrawer();
                                        },
                                    },
                                },
                            ]}
                            closeModal={closeDrawer}
                            currentOption={
                                currentMode === "Vmi" ? translate("Vendor Managed Inventory") : translate("Storefront")
                            }
                        />
                    )}
                    {userName && !isGuest && (
                        <PanelRow className="sign-out-row" onClick={onSignOutHandler} {...styles.signOutRow}>
                            <Typography className="sign-out-row-text" {...styles.signOutRowText}>
                                {isPunchOutSession ? translate("Cancel PunchOut") : translate("Sign Out")}
                            </Typography>
                        </PanelRow>
                    )}
                </StyledSection>
            </Drawer>
        </>
    );
};

const LogoImage = styled.img`
    margin-right: 10px;
    height: 22px;
`;

interface SelectorMenuProps {
    options?: MappedLink[];
    closeModal?: () => void;
    currentOption?: string;
    currentOptionIcon?: React.ReactNode;
    dataTestSelector?: string;
}

const SelectorMenu: React.FC<SelectorMenuProps> = ({
    options,
    closeModal,
    currentOption,
    currentOptionIcon,
    dataTestSelector,
}) => {
    if (!options || options.length <= 1) {
        return null;
    }

    const trigger = (
        <PanelRow hasChildren className="logo-links-row" {...styles.logoLinks}>
            <StyledSpan className="panel-section-wrapper" {...styles.panelSectionWrapper}>
                {currentOptionIcon}
                <Typography
                    className="logo-link-title"
                    data-test-selector={`${dataTestSelector}_currentOption`}
                    {...styles.logoLinks?.typographyProps}
                >
                    {currentOption}
                </Typography>
            </StyledSpan>
        </PanelRow>
    );

    return (
        <PanelMenu
            className="panel-menu"
            currentUrl={currentOption}
            data-test-selector={dataTestSelector}
            closeOverlay={closeModal}
            panelTrigger={trigger}
            menuItems={options}
            maxDepth={1}
            layer={0}
            {...styles.panelMenu}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(NavigationDrawer));
