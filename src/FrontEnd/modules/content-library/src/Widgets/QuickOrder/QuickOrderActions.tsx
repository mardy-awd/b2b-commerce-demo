import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addCartLines from "@insite/client-framework/Store/Data/Carts/Handlers/AddCartLines";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import clearProducts from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/ClearProducts";
import translate from "@insite/client-framework/Translate";
import { CartLineCollectionModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAddedToCartMessage from "@insite/content-library/Components/ProductAddedToCartMessage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    useOverflowMenu = "useOverflowMenu",
    hideForEmptyProductList = "hideForEmptyProductList",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.useOverflowMenu]: boolean;
        [fields.hideForEmptyProductList]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    const settingsCollection = getSettingsCollection(state);
    return {
        productInfos: state.pages.quickOrder.productInfos,
        products: state.pages.quickOrder.productInfos.map(o => getProductState(state, o.productId).value),
        orderUploadPageLink: getPageLinkByPageType(state, "OrderUploadPage"),
        cartPageLink: getPageLinkByPageType(state, "CartPage"),
        showAddToCartConfirmationDialog: settingsCollection.productSettings.showAddToCartConfirmationDialog,
        canOrderUpload: settingsCollection.orderSettings.canOrderUpload,
        allowMultipleWishLists: settingsCollection.wishListSettings.allowMultipleWishLists,
    };
};

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addCartLines: makeHandlerChainAwaitable(addCartLines),
    clearProducts,
    loadCurrentCart,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & HasHistory;

export interface QuickOrderActionsStyles {
    wrapper?: InjectableCss;
    buttonsHidden?: HiddenProps;
    menuHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addAllToCartButton?: ButtonPresentationProps;
    addToListButton?: ButtonPresentationProps;
    uploadOrderButton?: ButtonPresentationProps;
}

export const actionsStyles: QuickOrderActionsStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            clear: both;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        flex-flow: column;
                    `,
                    css`
                        flex-flow: column;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    overflowMenu: {
        buttonProps: {
            css: css`
                margin-left: 2px;
            `,
        },
    },
    addAllToCartButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        margin-top: 10px;
                    `,
                    css`
                        margin-top: 10px;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                ])}
        `,
    },
    addToListButton: {
        variant: "tertiary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        margin-top: 10px;
                        display: block;
                        width: 100%;
                    `,
                    css`
                        margin-top: 10px;
                        display: block;
                        width: 100%;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                    css`
                        margin-left: 10px;
                    `,
                ])}
        `,
    },
    uploadOrderButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: block;
                        width: 100%;
                    `,
                    css`
                        display: block;
                        width: 100%;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
};

const styles = actionsStyles;

const QuickOrderActions = ({
    fields,
    productInfos,
    products,
    history,
    orderUploadPageLink,
    cartPageLink,
    showAddToCartConfirmationDialog,
    canOrderUpload,
    allowMultipleWishLists,
    setAddToListModalIsOpen,
    addCartLines,
    clearProducts,
    loadCurrentCart,
}: Props) => {
    const toasterContext = useContext(ToasterContext);

    const [allQtysIsValid, setAllQtysIsValid] = useState(false);
    const productsExist = productInfos && productInfos.length > 0;

    useEffect(() => {
        setAllQtysIsValid(productInfos.every(o => o.qtyOrdered > 0));
    }, [productInfos]);

    if (fields.hideForEmptyProductList && !productsExist) {
        return null;
    }

    const uploadOrderClickHandler = () => {
        orderUploadPageLink && history.push(orderUploadPageLink.url);
    };

    const addAllToCartClickHandler = async () => {
        const reversedList = [...productInfos].reverse();
        const cartLinesCollection = (await addCartLines({ productInfos: reversedList })) as CartLineCollectionModel;

        if (showAddToCartConfirmationDialog) {
            const isQtyAdjusted = cartLinesCollection.cartLines?.some(cartLine => cartLine.isQtyAdjusted) ?? false;

            toasterContext.addToast({
                body: <ProductAddedToCartMessage isQtyAdjusted={isQtyAdjusted} multipleProducts={true} />,
                messageType: "success",
            });
        }
        clearProducts();
        cartPageLink && history.push(cartPageLink.url);
        loadCurrentCart({ shouldLoadFullCart: true });
    };

    const addToListClickHandler = () => {
        const productInfosToAdd = productInfos.filter(o => products.find(p => p?.id === o.productId)?.canAddToWishlist);
        if (!allowMultipleWishLists) {
            addToWishList({
                productInfos: productInfosToAdd,
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos: productInfosToAdd });
    };

    const canAddSomeToList = products.some(o => o?.canAddToWishlist);
    const buttons = (
        <>
            {canOrderUpload && (
                <Button
                    {...styles.uploadOrderButton}
                    onClick={uploadOrderClickHandler}
                    data-test-selector="quickOrder_UploadOrder"
                >
                    {translate("Upload Order")}
                </Button>
            )}
            {productsExist && canAddSomeToList && (
                <Button
                    {...styles.addToListButton}
                    onClick={addToListClickHandler}
                    disabled={!allQtysIsValid}
                    data-test-selector="quickOrder_addAllProductsToList"
                >
                    {translate("Add to List")}
                </Button>
            )}
        </>
    );

    return (
        <StyledWrapper {...styles.wrapper}>
            {fields.useOverflowMenu && (
                <>
                    <Hidden below="lg" {...styles.buttonsHidden} data-test-selector="quickOrder_buttons">
                        {buttons}
                    </Hidden>
                    <Hidden above="sm" {...styles.buttonsHidden}>
                        {buttons}
                    </Hidden>
                </>
            )}
            {!fields.useOverflowMenu && buttons}
            {productsExist && (
                <Button {...styles.addAllToCartButton} onClick={addAllToCartClickHandler} disabled={!allQtysIsValid}>
                    {translate("Add All to Cart & Check Out")}
                </Button>
            )}
            {fields.useOverflowMenu && (
                <Hidden below="md" above="md" {...styles.menuHidden}>
                    <OverflowMenu position="end" {...styles.overflowMenu}>
                        {canOrderUpload && (
                            <Clickable onClick={uploadOrderClickHandler}>{translate("Upload Order")}</Clickable>
                        )}
                        {productsExist && canAddSomeToList && (
                            <Clickable onClick={addToListClickHandler} disabled={!allQtysIsValid}>
                                {translate("Add to List")}
                            </Clickable>
                        )}
                    </OverflowMenu>
                </Hidden>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(QuickOrderActions)),
    definition: {
        group: "Quick Order",
        allowedContexts: ["QuickOrderPage"],
        displayName: "Actions",
        fieldDefinitions: [
            {
                name: fields.useOverflowMenu,
                displayName: "Use overflow menu on responsive views",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
            {
                name: fields.hideForEmptyProductList,
                displayName: "Hide if Product List is Empty",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
