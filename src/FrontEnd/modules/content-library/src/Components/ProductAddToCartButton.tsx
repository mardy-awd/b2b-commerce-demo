/* eslint-disable spire/export-styles */
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { getUnitNetPrice } from "@insite/client-framework/Services/Helpers/ProductPriceService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { canAddToCart, hasEnoughInventory } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import addToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddToCart";
import translate from "@insite/client-framework/Translate";
import { CartLineModel, ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";
import ProductAddedToCartMessage from "@insite/content-library/Components/ProductAddedToCartMessage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    labelOverride?: string;
    extendedStyles?: ButtonPresentationProps;
    notes?: string;
    configurationSelection?: SafeDictionary<string>;
    configurationCompleted?: boolean;
    variantSelectionCompleted?: boolean;
    subscription?: ProductSubscriptionDto;
}

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasProductContext;

const mapStateToProps = (state: ApplicationState, props: OwnProps & HasProductContext) => {
    const {
        productSettings: { showAddToCartConfirmationDialog },
        cartSettings: { addToCartPopupTimeout },
    } = getSettingsCollection(state);
    return {
        canAddToCart: canAddToCart(
            state,
            props.productContext.product,
            props.productContext.productInfo,
            props.configurationCompleted,
            props.variantSelectionCompleted,
        ),
        hasEnoughInventory: hasEnoughInventory(state, props.productContext),
        isUpdatingCart: state.context.isUpdatingCart,
        showAddToCartConfirmationDialog,
        addToCartPopupTimeout,
    };
};

const mapDispatchToProps = {
    addToCart: makeHandlerChainAwaitable<Parameters<typeof addToCart>[0], CartLineModel>(addToCart),
};

export const productAddToCartButtonStyles: ButtonPresentationProps = {};

const ProductAddToCartButton = ({
    productContext: {
        product: { id: productId, allowZeroPricing, quoteRequired },
        productInfo: { qtyOrdered, unitOfMeasure, pricing },
    },
    hasEnoughInventory,
    isUpdatingCart,
    showAddToCartConfirmationDialog,
    addToCartPopupTimeout,
    addToCart,
    canAddToCart,
    labelOverride,
    extendedStyles,
    notes,
    configurationSelection,
    configurationCompleted,
    variantSelectionCompleted,
    subscription,
    ...otherProps
}: Props) => {
    const toasterContext = useContext(ToasterContext);
    const [styles] = useState(() => mergeToNew(productAddToCartButtonStyles, extendedStyles));

    if (!hasEnoughInventory || !canAddToCart) {
        return null;
    }

    const addToCartClickHandler = async () => {
        if (!quoteRequired && !allowZeroPricing && pricing && getUnitNetPrice(pricing, 1).price === 0) {
            toasterContext.addToast({ body: siteMessage("Cart_InvalidPrice"), messageType: "danger" });
            return;
        }

        const sectionOptions =
            configurationSelection && Object.values(configurationSelection).length > 0
                ? Object.values(configurationSelection)
                      .filter(sectionOptionId => !!sectionOptionId)
                      .map(sectionOptionId => ({ sectionOptionId }))
                : undefined;
        const cartline = (await addToCart({
            productId,
            qtyOrdered,
            unitOfMeasure,
            notes,
            sectionOptions,
            subscription,
        })) as CartLineModel;

        if (showAddToCartConfirmationDialog) {
            toasterContext.addToast({
                body: <ProductAddedToCartMessage isQtyAdjusted={cartline.isQtyAdjusted} multipleProducts={false} />,
                messageType: "success",
                timeoutLength: cartline.isQtyAdjusted ? 1000 * 60 * 60 * 24 * 365 : addToCartPopupTimeout,
            });
        }
    };

    return (
        <Button
            {...styles}
            onClick={addToCartClickHandler}
            disabled={qtyOrdered <= 0 || isUpdatingCart}
            {...otherProps}
        >
            {labelOverride ?? translate("Add to Cart")}
        </Button>
    );
};
export default withProductContext(connect(mapStateToProps, mapDispatchToProps)(ProductAddToCartButton));
