import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export default interface ProductDetailsState {
    selectedProductId?: string;
    productInfosById?: SafeDictionary<ProductInfo>;
    selectedImageIndex: number;
    lastProductPath?: string;
    lastStyledOption?: string;
    variantSelection: SafeDictionary<string>;
    variantSelectionCompleted: boolean;
    configurationSelection: SafeDictionary<string>;
    configurationCompleted: boolean;
    isProductLoading?: boolean;
}
