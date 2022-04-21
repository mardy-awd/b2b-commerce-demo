import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import siteMessage from "@insite/client-framework/SiteMessage";
import addProduct from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/AddProduct";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductSelector, { ProductSelectorStyles } from "@insite/content-library/Components/ProductSelector";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    addProduct,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface QuickOrderSearchStyles {
    productSelector?: ProductSelectorStyles;
}

export const quickOrderSearchStyles: QuickOrderSearchStyles = {};

const styles = quickOrderSearchStyles;

const QuickOrderSearch = ({ addProduct }: Props) => {
    const toasterContext = useContext(ToasterContext);

    const addProductToOrder = (productInfo: ProductInfo, product: ProductModel) => {
        addProduct({ productInfo, product });
        toasterContext.addToast({ body: translate("Item Added"), messageType: "success" });
    };

    return (
        <ProductSelector
            selectButtonTitle={translate("Add to Order")}
            onSelectProduct={addProductToOrder}
            productIsConfigurableMessage={siteMessage("QuickOrder_CannotOrderConfigurable")}
            productIsUnavailableMessage={siteMessage("QuickOrder_ProductIsUnavailable")}
            extendedStyles={styles.productSelector}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(QuickOrderSearch),
    definition: {
        group: "Quick Order",
        allowedContexts: ["QuickOrderPage"],
    },
};

export default widgetModule;
