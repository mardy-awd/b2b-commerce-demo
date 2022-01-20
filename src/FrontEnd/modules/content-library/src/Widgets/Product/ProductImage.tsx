/* eslint-disable spire/export-styles */
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import * as React from "react";

const ProductImage: React.FC<HasProduct> = ({ product }) => {
    if (!product) {
        return null;
    }

    return <img src={product.mediumImagePath} alt={product.imageAltText} />;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductImage),
    definition: {
        group: "Products",
        allowedContexts: ["ProductDetailsPage"],
    },
};

export default widgetModule;
