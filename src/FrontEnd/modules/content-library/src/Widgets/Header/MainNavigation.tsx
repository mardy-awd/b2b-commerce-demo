import { getCookie } from "@insite/client-framework/Common/Cookies";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { setMainNavigation } from "@insite/client-framework/Components/ShellHoleConnect";
import Logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    getCategoriesDataView,
    getCategoryDepthLoaded,
    getCategoryState,
    getSubCategoryIds,
} from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import loadCategories from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategories";
import loadCategory from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategory";
import { getPageLinkByNodeId, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { StylesContext } from "@insite/content-library/additionalStyles";
import MainNavigationItem from "@insite/content-library/Components/MainNavigationItem";
import NavigationDrawer from "@insite/content-library/Components/NavigationDrawer";
import { NavigationModeCookieName } from "@insite/content-library/Components/NavigationModeMenu";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import { IconProps } from "@insite/mobius/Icon";
import Search from "@insite/mobius/Icons/Search";
import X from "@insite/mobius/Icons/X";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { MenuPresentationProps } from "@insite/mobius/Menu";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { PopoverPresentationProps, PositionStyle } from "@insite/mobius/Popover";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import { resolveColor } from "@insite/mobius/utilities";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as cssLinter from "css";
import isEqual from "lodash/isEqual";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    links = "links",
    showQuickOrder = "showQuickOrder",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.links]: LinkModel[];
        [fields.showQuickOrder]: boolean;
        [fields.customCSS]: string;
    };
    isCompactHeaderFlyoutMenu: boolean;
    flyoutCustomCSS?: string;
    isCompactHeaderMainNavigation: boolean;
    сompactHeaderMainNavigationCustomCSS?: string;
}

interface LinkModel {
    fields: {
        openInNewWindow: boolean;
        destination: LinkFieldValue;
        linkType: "Link" | "MegaMenu" | "CascadingMenu";
        overrideTitle: string;
        title: string;
        numberOfColumns: number;
        maxDepth: number;
    };
}

export interface MappedLink {
    title: string;
    url: string;
    type?: string;
    excludeFromNavigation?: boolean;
    openInNewWindow?: boolean;
    numberOfColumns?: number;
    maxDepth?: number;
    childrenType?: "MegaMenu" | "CascadingMenu";
    children?: MappedLink[];
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const {
        fields: { links = [] },
    } = ownProps;
    const mappedLinks = [];
    const categoryIdsToLoad: Dictionary<number> = {};

    for (const link of links) {
        const {
            fields: { linkType, destination, openInNewWindow, overrideTitle, numberOfColumns, maxDepth, title },
        } = link;
        const { type, value } = destination;

        const depthToLoad = linkType === "MegaMenu" ? 2 : maxDepth;

        let mappedLink: MappedLink | undefined;

        if (type === "Url") {
            mappedLink = {
                url: value,
                title,
            };
        } else if (type === "Page") {
            const readonlyPageLink = getPageLinkByNodeId(state, value);
            if (readonlyPageLink) {
                mappedLink = { ...readonlyPageLink };
                if (overrideTitle) {
                    mappedLink.title = overrideTitle;
                }
            }
        } else if (type === "Category") {
            mappedLink = setupCategoryLink(
                state,
                value,
                categoryIdsToLoad,
                depthToLoad,
                overrideTitle,
                state.data.categories.categoryIdsCalled,
            );
        }

        if (!mappedLink) {
            continue;
        }

        mappedLink.openInNewWindow = openInNewWindow;
        mappedLink.numberOfColumns = numberOfColumns;
        mappedLink.maxDepth = maxDepth;

        if (linkType === "MegaMenu" || linkType === "CascadingMenu") {
            mappedLink.childrenType = linkType;
        }

        mappedLinks.push(mappedLink);
    }

    const currentMode = getCookie(NavigationModeCookieName) || "Storefront";
    const orderSettings = getSettingsCollection(state).orderSettings;
    const session = getSession(state);
    const isAuthenticated = session?.isAuthenticated && !session?.isGuest;

    return {
        links: mappedLinks,
        quickOrderLink: getPageLinkByPageType(state, "QuickOrderPage"),
        categoryIdsToLoad,
        allowQuickOrder: orderSettings.allowQuickOrder,
        categoryErrorStatusCodeById: state.data.categories.errorStatusCodeById,
        categoryIdsCalled: state.data.categories.categoryIdsCalled,
        displayChangeCustomerLink: session?.displayChangeCustomerLink,
        displayVmiNavigation:
            currentMode === "Vmi" &&
            orderSettings.vmiEnabled &&
            isAuthenticated &&
            session.userRoles?.toLowerCase().indexOf("vmi_admin") !== -1,
        displayModeSwitch:
            isAuthenticated && orderSettings.vmiEnabled && session.userRoles?.toLowerCase().indexOf("vmi_admin") !== -1,
        currentMode,
        vmiPageLinks: [
            getPageLinkByPageType(state, "VmiDashboardPage"),
            getPageLinkByPageType(state, "VmiLocationsPage"),
            getPageLinkByPageType(state, "VmiUsersPage"),
            getPageLinkByPageType(state, "VmiBinsPage"),
            getPageLinkByPageType(state, "VmiReportingPage"),
            getPageLinkByPageType(state, "VmiOrderHistoryPage"),
        ],
    };
};

const getParameter = (categoryId: string, maxDepth: number) => ({
    maxDepth,
    startCategoryId: categoryId === emptyGuid ? undefined : categoryId,
    includeStartCategory: categoryId !== emptyGuid,
});

const setupCategoryLink = (
    state: ApplicationState,
    value: string,
    categoryIdsToLoad: Dictionary<number>,
    maxDepth: number,
    overrideTitle: string,
    categoryIdsCalled: string[],
) => {
    let mappedLink: MappedLink | undefined;

    if (!value) {
        return;
    }

    const depthLoaded = getCategoryDepthLoaded(state, value);
    const subCategoryIds = getSubCategoryIds(state, value);
    if (
        (depthLoaded < maxDepth || (!subCategoryIds && !categoryIdsCalled?.includes(value))) &&
        !getCategoriesDataView(state, getParameter(value, maxDepth)).isLoading
    ) {
        categoryIdsToLoad[value] = maxDepth;
    } else {
        if (value === emptyGuid) {
            mappedLink = {
                url: "",
                title: overrideTitle || translate("Products"),
            };
        } else {
            const categoryState = getCategoryState(state, value);
            if (!categoryState.value) {
                if (
                    !categoryState.isLoading &&
                    !getCategoriesDataView(state, getParameter(value, maxDepth)).isLoading
                ) {
                    categoryIdsToLoad[value] = maxDepth;
                }
                return;
            }
            mappedLink = {
                url: categoryState.value.path,
                title: overrideTitle || categoryState.value.shortDescription,
            };
        }

        loadSubCategories(mappedLink, subCategoryIds, 1, maxDepth, state);
    }

    return mappedLink;
};

const loadSubCategories = (
    mappedLink: MappedLink,
    subCategoryIds: readonly string[] | undefined,
    currentDepth: number,
    maxDepth: number,
    state: ApplicationState,
) => {
    if (currentDepth > maxDepth) {
        return;
    }
    mappedLink.children = [];
    if (!subCategoryIds) {
        return;
    }
    for (const subCategoryId of subCategoryIds) {
        const subCategory = getCategoryState(state, subCategoryId).value;
        if (!subCategory) {
            Logger.error(`Category ${subCategoryId} was not found in data state, excluding from navigation.`);
            continue;
        }
        const childLink: MappedLink = {
            url: subCategory.path,
            title: subCategory.shortDescription,
            children: [],
        };
        mappedLink.children.push(childLink);

        loadSubCategories(childLink, subCategory.subCategoryIds, currentDepth + 1, maxDepth, state);
    }
};

const mapDispatchToProps = {
    loadCategories,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    selectedLinkIndex?: number;
    mobileSearchModalIsOpen: boolean;
}

export interface MainNavigationStyles {
    menuHeight: number;
    container?: InjectableCss;
    itemWrapper?: InjectableCss;
    quickOrderItemWrapper?: InjectableCss;
    menuItem?: InjectableCss;
    menuItemIcon?: IconProps;
    menuItemTypography?: TypographyPresentationProps;
    cascadingMenu?: MenuPresentationProps;
    megaMenu?: PopoverPresentationProps;
    megaMenuGridContainer?: GridContainerProps;
    megaMenuGridItem?: GridItemProps;
    megaMenuHeading?: LinkPresentationProps;
    megaMenuLink?: LinkPresentationProps;
    mobileWrapper?: InjectableCss;
    compactFlyoutMenu?: InjectableCss;
    mobileMenuWrapper?: InjectableCss;
    mobileSearchButton?: ButtonPresentationProps;
    mobileSearchWrapper?: InjectableCss;
    mobileSearchModal?: ModalPresentationProps;
    mobileSearchInputWrapper?: InjectableCss;
    mobileSearchInputStyles?: SearchInputStyles;
    mobileSearchModalCloseIcon?: IconProps;
}

export const mainNavigationStyles: MainNavigationStyles = {
    menuHeight: 50,
    container: {
        css: css`
            color: ${getColor("common.background")};
            padding: 0 16px 0 45px;
            display: flex;
            justify-content: left;
        `,
    },
    itemWrapper: {
        css: css`
            position: relative;
            overflow: visible;
            display: flex;
            &:hover span + div {
                display: block;
            }
            &:first-child {
                margin-left: -10px;
            }
        `,
    },
    quickOrderItemWrapper: {
        css: css`
            margin-left: auto;
            margin-right: 0;
        `,
    },
    megaMenuGridItem: {
        css: css`
            display: block;
        `,
    },
    megaMenuHeading: {
        css: css`
            font-weight: bold;
            margin-bottom: 8px;
        `,
    },
    menuItem: {
        css: css`
            display: flex;
            align-items: center;
            height: 50px;
            padding: 0 10px;
        `,
    },
    menuItemIcon: {
        css: css`
            margin: -3px 0 0 10px;
        `,
        size: 18,
        color: "secondary.contrast",
    },
    menuItemTypography: {
        variant: "headerSecondary",
        color: "secondary.contrast",
        css: css`
            font-weight: 800;
        `,
    },
    megaMenu: {
        transitionDuration: "short",
        contentBodyProps: {
            _height: "1200px",
            css: css`
                padding: 20px 30px;
            `,
        },
    },
    mobileSearchButton: {
        size: 48,
        buttonType: "solid",
        color: "secondary",
        css: css`
            padding: 0 10px;
        `,
    },
    mobileWrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
        `,
    },
    compactFlyoutMenu: {
        css: css`
            & button {
                background: transparent;
                border: none;
                &:hover {
                    background: rgba(0, 0, 0, 0.3);
                }

                svg {
                    color: ${props => resolveColor(props.theme.header.linkColor, props.theme)};
                }
            }
        `,
    },
    mobileSearchWrapper: {
        css: css`
            text-align: right;
        `,
    },
    mobileMenuWrapper: {
        css: css`
            text-align: right;
        `,
    },
    mobileSearchInputWrapper: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    mobileSearchInputStyles: {
        input: {
            cssOverrides: {
                formField: css`
                    width: 100%;
                `,
            },
        },
        popover: {
            wrapperProps: {
                css: css`
                    width: calc(100% - 45px);
                `,
            },
        },
        popoverContentBody: {
            as: "div",
            _height: "100%",
            css: css`
                box-shadow: none;
            `,
        },
        autocompleteWrapper: {
            css: css`
                display: flex;
                flex-direction: column;
            `,
        },
        autocompleteColumnWrapper: {
            css: css`
                display: flex;
                flex-direction: column;
                width: 100%;
                padding: 0 50px 0 30px;
            `,
        },
        searchHistoryStyles: {
            wrapper: {
                css: css`
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0 50px 15px 30px;
                `,
            },
        },
        autocompleteProductsStyles: {
            titleLink: {
                css: css`
                    width: 100%;
                `,
            },
            erpNumberText: {
                css: css`
                    width: 100%;
                    text-align: left;
                    margin: 5px 0 0 0;
                `,
            },
        },
    },
    mobileSearchModalCloseIcon: {
        src: X,
        size: 18,
        css: css`
            margin-left: 10px;
        `,
    },
};

const defaultCustomCss = `.mobile-wrapper {
}

.mobile-menu-wrapper {
}

.menu-trigger-button {
}

.menu-trigger-button-icon {
}

.drawer {
}

.drawer-section-wrapper {
}

.panel-menu {
}

.main-navigation-row {
}

.panel-section-wrapper {
}

.main-navigation-row-icon {
}

.user-row-text {
}

.punch-out-navigation-row-icon {
}

.punch-out-user-row-text {
}

.main-navigation-row-text {
}

.logo-links-row {
}

.logo-link-title {
}

.language-image {
}

.menu-row-icon {
}

.change-customer-row {
}

.change-customer-row-container {
}

.fulfillment-method-grid-item {
}

.addresses-grid-item {
}

.pick-up-address-grid-item {
}

.apply-button-grid-item {
}

.sign-out-row {
}

.sign-out-row-text {
}

.mobile-search-wrapper {
}

.mobile-search-button {
}

.mobile-search-button-icon {
}

.container {
}

.item-wrapper {
}

.cascading-menu {
}

.menu-item {
}

.mega-menu {
}

.mega-menu-grid-container {
}

.mega-menu-grid-item {
}

.mega-menu-heading-link {
}

.mega-menu-link {
}

.quick-order-item-wrapper {
}

.quick-order-link {
}

.vmi-page-link {
}

.mobile-search-modal {
}`;

export class MainNavigation extends React.Component<Props, State> {
    container = React.createRef<HTMLDivElement>();
    mobileSearchInput = React.createRef<HTMLInputElement>();
    declare context: React.ContextType<typeof StylesContext>;

    constructor(props: Props) {
        super(props);

        this.state = {
            mobileSearchModalIsOpen: false,
        };
    }

    UNSAFE_componentWillMount(): void {
        this.loadCategoriesIfNeeded();

        setMainNavigation({
            close: () => {
                this.setState({
                    selectedLinkIndex: undefined,
                });
            },
            openMenu: (index: number) => {
                this.setState({
                    selectedLinkIndex: index,
                });
            },
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (!isEqual(this.props.categoryIdsToLoad, prevProps.categoryIdsToLoad)) {
            this.loadCategoriesIfNeeded(true);
        }
    }

    loadCategoriesIfNeeded(isComponentDidUpdate = false) {
        const { categoryIdsToLoad } = this.props;
        for (const categoryId of Object.keys(categoryIdsToLoad)) {
            if (!this.props.categoryErrorStatusCodeById?.[categoryId]) {
                const maxDepth = categoryIdsToLoad[categoryId];
                if (!this.props.categoryIdsCalled?.includes(categoryId) || isComponentDidUpdate) {
                    this.props.loadCategories(getParameter(categoryId, maxDepth));
                }
            }
        }
    }

    getMobileSearchAutocompletePosition = (element: React.RefObject<HTMLUListElement>) => {
        const positionStyle: PositionStyle = {
            position: "fixed",
        };

        if (element.current) {
            const rect = element.current.getBoundingClientRect();
            positionStyle.top = rect.top + rect.height;
            positionStyle.left = 0;
            positionStyle.width = `${document.documentElement.clientWidth}px`;
            positionStyle.height = `${document.documentElement.clientHeight - positionStyle.top}px`;
        }

        return positionStyle;
    };

    mobileSearchButtonClickHandler = () => {
        this.setState({ mobileSearchModalIsOpen: true }, () => {
            setTimeout(() => {
                if (this.mobileSearchInput?.current) {
                    this.mobileSearchInput.current.focus();
                    this.mobileSearchInput.current.click();
                }
            }, 250);
        });
    };

    mobileSearchModalCloseHandler = () => {
        this.setState({ mobileSearchModalIsOpen: false });
    };

    render() {
        const {
            links,
            quickOrderLink,
            fields: { showQuickOrder, customCSS },
            id,
            allowQuickOrder,
            isCompactHeaderFlyoutMenu,
            flyoutCustomCSS,
            isCompactHeaderMainNavigation,
            сompactHeaderMainNavigationCustomCSS,
            vmiPageLinks,
            displayVmiNavigation,
            displayModeSwitch,
            currentMode,
        } = this.props;
        const { selectedLinkIndex } = this.state;

        const showQuickOrderLink = showQuickOrder && allowQuickOrder;
        const mainNavContextStyles = this?.context?.styles?.mainNavigation ?? {};
        const styles = mergeToNew(mainNavigationStyles, mainNavContextStyles);

        if (isCompactHeaderFlyoutMenu) {
            const flyoutCustomCssWrapper = {
                css: css`
                    ${flyoutCustomCSS}
                `,
            };

            return (
                <StyledWrapper {...flyoutCustomCssWrapper}>
                    <StyledWrapper className="flyout-menu-wrapper" {...styles.compactFlyoutMenu}>
                        <NavigationDrawer
                            links={links}
                            showQuickOrder={showQuickOrderLink}
                            quickOrderLink={quickOrderLink}
                            displayVmiNavigation={displayVmiNavigation}
                            vmiPageLinks={vmiPageLinks}
                            displayModeSwitch={displayModeSwitch}
                            currentMode={currentMode}
                            isCompactHeaderFlyout={true}
                        />
                    </StyledWrapper>
                </StyledWrapper>
            );
        }

        if (isCompactHeaderMainNavigation) {
            const mainNavigationCustomCSSWrapper = {
                css: css`
                    ${сompactHeaderMainNavigationCustomCSS}
                `,
            };

            return (
                <StyledWrapper {...mainNavigationCustomCSSWrapper}>
                    <StyledWrapper className="container" {...styles.container} ref={this.container}>
                        {links.map((link, index) => {
                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <StyledWrapper className="item-wrapper" {...styles.itemWrapper} key={index}>
                                    <MainNavigationItem
                                        index={index}
                                        link={link}
                                        styles={styles}
                                        container={this.container}
                                        isOpen={index === selectedLinkIndex}
                                        displayChangeCustomerLink={this.props.displayChangeCustomerLink}
                                    />
                                </StyledWrapper>
                            );
                        })}
                        {showQuickOrderLink && quickOrderLink && (
                            <StyledWrapper className="item-wrapper" {...styles.itemWrapper}>
                                <StyledWrapper className="quick-order-item-wrapper" {...styles.quickOrderItemWrapper}>
                                    <Link
                                        className="quick-order-link"
                                        typographyProps={styles.menuItemTypography}
                                        color={styles.menuItemTypography?.color}
                                        {...styles.menuItem}
                                        id="quickOrder"
                                        href={quickOrderLink.url}
                                    >
                                        {quickOrderLink.title}
                                    </Link>
                                </StyledWrapper>
                            </StyledWrapper>
                        )}
                    </StyledWrapper>
                </StyledWrapper>
            );
        }

        const customCssWrapper = {
            css: css`
                ${customCSS}
            `,
        };

        return (
            <StyledWrapper {...customCssWrapper}>
                <StyledWrapper className="mobile-wrapper" {...styles.mobileWrapper}>
                    <Hidden className="mobile-menu-wrapper" above="md" {...styles.mobileMenuWrapper}>
                        <NavigationDrawer
                            links={links}
                            showQuickOrder={showQuickOrderLink}
                            quickOrderLink={quickOrderLink}
                            displayVmiNavigation={displayVmiNavigation}
                            vmiPageLinks={vmiPageLinks}
                            displayModeSwitch={displayModeSwitch}
                            currentMode={currentMode}
                        />
                    </Hidden>
                    <Hidden className="mobile-search-wrapper" above="sm" {...styles.mobileSearchWrapper}>
                        <Button
                            className="mobile-search-button"
                            {...styles.mobileSearchButton}
                            onClick={this.mobileSearchButtonClickHandler}
                        >
                            <ButtonIcon className="mobile-search-button-icon" src={Search} />
                            <VisuallyHidden>{translate("Search")}</VisuallyHidden>
                        </Button>
                    </Hidden>
                </StyledWrapper>
                <Hidden below="lg">
                    {!displayVmiNavigation && (
                        <StyledWrapper className="container" {...styles.container} ref={this.container}>
                            {links.map((link, index) => {
                                return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <StyledWrapper className="item-wrapper" {...styles.itemWrapper} key={index}>
                                        <MainNavigationItem
                                            index={index}
                                            link={link}
                                            styles={styles}
                                            container={this.container}
                                            isOpen={index === selectedLinkIndex}
                                            displayChangeCustomerLink={this.props.displayChangeCustomerLink}
                                        />
                                    </StyledWrapper>
                                );
                            })}
                            {showQuickOrderLink && quickOrderLink && (
                                <StyledWrapper className="item-wrapper" {...styles.itemWrapper}>
                                    <StyledWrapper
                                        className="quick-order-item-wrapper"
                                        {...styles.quickOrderItemWrapper}
                                    >
                                        <Link
                                            className="quick-order-link"
                                            typographyProps={styles.menuItemTypography}
                                            color={styles.menuItemTypography?.color}
                                            {...styles.menuItem}
                                            id="quickOrder"
                                            href={quickOrderLink.url}
                                        >
                                            {quickOrderLink.title}
                                        </Link>
                                    </StyledWrapper>
                                </StyledWrapper>
                            )}
                        </StyledWrapper>
                    )}
                    {displayVmiNavigation && (
                        <StyledWrapper className="container" {...styles.container} ref={this.container}>
                            <StyledWrapper className="item-wrapper" {...styles.itemWrapper}>
                                {vmiPageLinks.map(
                                    link =>
                                        link && (
                                            <Link
                                                className="vmi-page-link"
                                                key={link.id}
                                                typographyProps={styles.menuItemTypography}
                                                color={styles.menuItemTypography?.color}
                                                {...styles.menuItem}
                                                id={link.id}
                                                href={link.url}
                                            >
                                                {link.title}
                                            </Link>
                                        ),
                                )}
                            </StyledWrapper>
                        </StyledWrapper>
                    )}
                </Hidden>
                <Modal
                    className="mobile-search-modal"
                    {...styles.mobileSearchModal}
                    isOpen={this.state.mobileSearchModalIsOpen}
                    closeOnEsc={true}
                    handleClose={this.mobileSearchModalCloseHandler}
                    headline={
                        <SearchInput
                            id={id}
                            inputRef={this.mobileSearchInput}
                            autocompletePositionFunction={this.getMobileSearchAutocompletePosition}
                            onBeforeGoToUrl={this.mobileSearchModalCloseHandler}
                            extendedStyles={styles.mobileSearchInputStyles}
                        />
                    }
                />
            </StyledWrapper>
        );
    }
}

MainNavigation.contextType = StylesContext;

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const mainNavigation: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MainNavigation),
    definition: {
        group: "Header",
        icon: "magnifying-glass",
        allowedContexts: ["Header"],
        fieldDefinitions: [
            {
                name: fields.links,
                editorTemplate: "ListField",
                onEditRow: (index: number, dispatch) => {
                    dispatch({
                        type: "SendToSite/OpenMainNavigation",
                        index,
                    });
                },
                onDoneEditingRow: dispatch => {
                    dispatch({
                        type: "SendToSite/CloseMainNavigation",
                    });
                },
                onLoad: dispatch => {
                    dispatch({
                        type: "SendToSite/CloseMainNavigation",
                    });
                },
                getDisplay: (item: HasFields, state) => {
                    const { type, value } = item.fields.destination;
                    const { overrideTitle, title } = item.fields;
                    if (type === "Page") {
                        const link = getPageLinkByNodeId(state, value);
                        return overrideTitle || link?.title;
                    }
                    if (type === "Category") {
                        if (overrideTitle) {
                            return overrideTitle;
                        }
                        if (value === emptyGuid) {
                            return "Products";
                        }
                        const categoryState = getCategoryState(state, value);
                        if (!categoryState.value) {
                            if (!categoryState.isLoading && value) {
                                return dispatch => {
                                    dispatch(
                                        loadCategory({
                                            id: value,
                                        }),
                                    );
                                };
                            }
                            return "";
                        }
                        return categoryState.value.shortDescription;
                    }
                    if (type === "Url") {
                        return title ?? value;
                    }
                    return value;
                },
                defaultValue: [],
                fieldType: "Translatable",
                fieldDefinitions: [
                    {
                        name: "linkType",
                        editorTemplate: "RadioButtonsField",
                        defaultValue: "Link",
                        isRequired: true,
                        options: [
                            {
                                displayName: "Link",
                                value: "Link",
                            },
                            {
                                displayName: "Mega Menu",
                                value: "MegaMenu",
                            },
                            {
                                displayName: "Cascading Menu",
                                value: "CascadingMenu",
                            },
                        ],
                    },
                    {
                        name: "destination",
                        editorTemplate: "LinkField",
                        defaultValue: {
                            value: "",
                            type: "Page",
                        },
                        isRequired: true,
                        allowUrls: item => item.fields.linkType === "Link",
                        showCategoryRoot: item => true,
                    },
                    {
                        name: "overrideTitle",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isVisible: item => item.fields.destination.type !== "Url",
                    },
                    {
                        name: "title",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isRequired: true,
                        isVisible: item => item.fields.destination.type === "Url",
                    },
                    {
                        name: "numberOfColumns",
                        editorTemplate: "DropDownField",
                        defaultValue: 6,
                        options: [{ value: 2 }, { value: 3 }, { value: 4 }, { value: 6 }],
                        isRequired: true,
                        isVisible: (item: HasFields) => item.fields.linkType === "MegaMenu",
                    },
                    {
                        name: "maxDepth",
                        editorTemplate: "DropDownField",
                        defaultValue: 3,
                        options: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
                        isRequired: true,
                        isVisible: (item: HasFields) => item.fields.linkType === "CascadingMenu",
                    },
                    {
                        name: "openInNewWindow",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                        isVisible: (item: HasFields) => item.fields.linkType === "Link",
                    },
                ],
                tab: basicTab,
            },
            {
                name: fields.showQuickOrder,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                tab: basicTab,
            },
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
                tab: advancedTab,
                defaultValue: defaultCustomCss,
                isVisible: (item, shouldDisplayAdvancedFeatures) => !!shouldDisplayAdvancedFeatures,
                validate: value => {
                    if (value === undefined || value === null) {
                        return "";
                    }

                    const result = cssLinter.parse(value, { silent: true });
                    if (result?.stylesheet?.parsingErrors) {
                        // the error output at this time only has room for one line so we just show the first error
                        return result.stylesheet.parsingErrors.length <= 0
                            ? ""
                            : result.stylesheet.parsingErrors.map(error => `${error.reason} on line ${error.line}`)[0];
                    }

                    return "Unable to parse Css";
                },
                options: {
                    mode: "css",
                    lint: true,
                    autoRefresh: true,
                },
            },
        ],
    },
};

export default mainNavigation;
