import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { Session } from "@insite/client-framework/Services/SessionService";
import { getBrandStateById } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import loadBrand from "@insite/client-framework/Store/Data/Brands/Handlers/LoadBrand";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        product: ProductModel;
        productInfo?: ProductInfo;
        session: Session;
        brandId?: string | null;
        categoryIdWithBrandId?: string | null;
        categoryId?: string | null;
    },
    { structuredPageData: string }
>;

export const PrepareStructuredPageData: HandlerType = async props => {
    const {
        id,
        productTitle,
        smallImagePath,
        mediumImagePath,
        largeImagePath,
        canonicalUrl,
        manufacturerItem,
        detail,
        brand: productBrand,
    } = props.parameter.product;
    const state = props.getState();

    const data = {
        "@context": "https://schema.org",
        "@type": "Product",
        productID: id,
        name: productTitle,
        image: [smallImagePath, mediumImagePath, largeImagePath],
        mpn: manufacturerItem,
        sku: detail?.sku,
        url: canonicalUrl,
    } as any;

    const productInfo = props.parameter.productInfo;
    if (productInfo) {
        await waitFor(() => !!productInfo.pricing && !!productInfo.inventory);

        const { pricing, inventory, unitOfMeasure } = productInfo;

        if (pricing && inventory) {
            const availability = inventory?.inventoryAvailabilityDtos?.find(
                o => o.unitOfMeasure.toLowerCase() === (unitOfMeasure?.toLowerCase() || ""),
            )?.availability;

            data.offers = {
                "@type": "Offer",
                availability:
                    availability?.messageType !== 2
                        ? availability?.messageType === 3
                            ? "https://schema.org/LimitedAvailability"
                            : "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                price: pricing.unitNetPrice,
                priceCurrency: props.parameter.session?.currency?.currencyCode,
                url: canonicalUrl,
            };
        }
    }

    if (!data.offers) {
        props.result = { structuredPageData: "" };
        return;
    }

    if (props.parameter.brandId) {
        let brandState = getBrandStateById(state, props.parameter.brandId);
        let brand = productBrand || brandState.value;
        if (!brand && !brandState.isLoading) {
            const awaitableLoadBrand = makeHandlerChainAwaitable(loadBrand);
            await awaitableLoadBrand({ brandId: props.parameter.brandId })(props.dispatch, props.getState);
            brandState = getBrandStateById(props.getState(), props.parameter.brandId);
            brand = brandState.value;
        }

        if (brand) {
            data.brand = {
                "@type": "Brand",
                identifier: brand.id,
                name: brand.name,
                url: brand.detailPagePath,
            };
        }
    }

    if (props.parameter.categoryIdWithBrandId || props.parameter.categoryId) {
        const category = getCategoryState(
            state,
            props.parameter.categoryIdWithBrandId || props.parameter.categoryId || "",
        ).value;

        if (category) {
            data.category = category.path;
        }
    }

    props.result = { structuredPageData: JSON.stringify(data) };
};

export const DispatchSetStructuredPageData: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/SetStructuredPageData",
        structuredPageData: props.result.structuredPageData,
    });
};

export const DispatchSetStructuredPageDataSetForId: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/SetStructuredPageDataSetForId",
        productId: props.parameter.product.id,
    });
};

export const chain = [PrepareStructuredPageData, DispatchSetStructuredPageData, DispatchSetStructuredPageDataSetForId];

const generateStructuredPageData = createHandlerChainRunner(chain, "GenerateStructuredPageData");
export default generateStructuredPageData;
