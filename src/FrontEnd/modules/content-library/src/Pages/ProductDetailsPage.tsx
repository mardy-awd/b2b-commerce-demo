import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import { trackPageChange } from "@insite/client-framework/Common/Utilities/tracking";
import { ParentProductIdContext } from "@insite/client-framework/Components/ParentProductContext";
import { ProductContext, ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getSelectedProductPath,
    getSession,
    getSettingsCollection,
} from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import {
    getComputedVariantProduct,
    getProductState,
    getProductStateByPath,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import changeQtyOrdered from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/ChangeQtyOrdered";
import changeUnitOfMeasure from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/ChangeUnitOfMeasure";
import displayProduct from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/DisplayProduct";
import generateStructuredPageData from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/GenerateStructuredPageData";
import resetSelections from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/ResetSelections";
import setMetadataSetForId from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/SetMetadataSetForId";
import { EnableStructuredPageData } from "@insite/client-framework/Types/FieldDefinition";
import { HideFooter, HideHeader } from "@insite/client-framework/Types/FieldDefinition";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const productPath =
        getSelectedProductPath(state) ||
        (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);
    const productState = getProductStateByPath(state, productPath);
    const catalogPageState = getCatalogPageStateByPath(state, productPath);
    const variantProductState = getProductState(state, state.pages.productDetails.selectedProductId);
    const computedVariantProduct = getComputedVariantProduct(productState, variantProductState);
    const settingsCollection = getSettingsCollection(state);
    return {
        productState: computedVariantProduct,
        catalogPageState,
        parentProductState: productState,
        productInfo:
            computedVariantProduct.value && state.pages.productDetails.productInfosById
                ? state.pages.productDetails.productInfosById[computedVariantProduct.value.id]
                : undefined,
        productPath,
        lastProductPath: state.pages.productDetails.lastProductPath,
        lastStyledOption: state.pages.productDetails.lastStyledOption,
        websiteName: state.context.website.name,
        page: getCurrentPage(state),
        location,
        websiteSettings: settingsCollection.websiteSettings,
        searchPath: settingsCollection.searchSettings.searchPath,
        selectedProductId: state.pages.productDetails.selectedProductId,
        isProductLoading: state.pages.productDetails.isProductLoading,
        metadataSetForId: state.pages.productDetails.metadataSetForId,
        structuredPageData: state.pages.productDetails.structuredPageData,
        structuredPageDataSetForId: state.pages.productDetails.structuredPageDataSetForId,
        session: getSession(state),
    };
};

const mapDispatchToProps = {
    displayProduct,
    changeQtyOrdered,
    changeUnitOfMeasure,
    resetSelections,
    generateStructuredPageData,
    setMetadataSetForId,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & PageProps;

class ProductDetailsPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        this.displayProductIfNeeded();
        this.setMetadata();
    }

    componentDidUpdate(): void {
        this.displayProductIfNeeded();

        const { productState } = this.props;
        if (productState.value && productState.value.id !== this.props.metadataSetForId) {
            trackPageChange();
            this.setMetadata();
        }
    }

    componentWillUnmount() {
        this.props.resetSelections();
    }

    setMetadata() {
        const {
            productState: { value: product },
            catalogPageState,
            websiteName,
            location,
            websiteSettings,
            page,
            structuredPageData,
            productInfo,
            session,
            metadataSetForId,
            structuredPageDataSetForId,
        } = this.props;

        if (!catalogPageState?.value || !product) {
            return;
        }

        if (page.fields.enableStructuredPageData && product.id !== structuredPageDataSetForId) {
            this.props.generateStructuredPageData({
                product,
                productInfo,
                session,
                brandId: catalogPageState.value.brandId || product.brand?.id,
                categoryIdWithBrandId: catalogPageState.value.categoryIdWithBrandId,
                categoryId: catalogPageState.value.categoryId,
            });
            return;
        }

        const {
            metaDescription,
            metaKeywords,
            openGraphImage,
            openGraphTitle,
            openGraphUrl,
            title,
            alternateLanguageUrls,
        } = catalogPageState.value;

        setPageMetadata(
            {
                metaDescription,
                metaKeywords,
                openGraphImage,
                openGraphTitle,
                openGraphUrl,
                currentPath: location.pathname,
                canonicalPath: product.canonicalUrl,
                title: title || product.productTitle,
                websiteName,
                alternateLanguageUrls: alternateLanguageUrls ?? undefined,
                structuredPageData,
            },
            websiteSettings,
        );

        if (product.id !== metadataSetForId) {
            this.props.setMetadataSetForId({
                metadataSetForId: product.id,
            });
        }
    }

    displayProductIfNeeded() {
        const {
            location: { search },
            productPath,
            lastProductPath,
            lastStyledOption,
            isProductLoading,
            searchPath,
        } = this.props;
        const queryParams = parseQueryString<{ option?: string; criteria?: string }>(search.replace("?", ""));
        const styledOption = (
            queryParams.option?.toString() ||
            queryParams.criteria?.toString() ||
            ""
        ).toLocaleLowerCase();
        if (
            (productPath.toLowerCase() === lastProductPath?.toLowerCase() &&
                styledOption === lastStyledOption?.toLowerCase()) ||
            productPath.toLowerCase() === `/${searchPath.toLowerCase()}`
        ) {
            return;
        }

        if (isProductLoading) {
            return;
        }

        this.props.displayProduct({ path: productPath, styledOption });
    }

    render() {
        if (
            !this.props.productState.value ||
            this.props.productState.isLoading ||
            !this.props.productInfo ||
            (this.props.productPath &&
                this.props.lastProductPath &&
                this.props.productPath.toLowerCase() !== this.props.lastProductPath.toLowerCase())
        ) {
            return null;
        }

        const productId = this.props.productState.value.id;

        const productContext: ProductContextModel = {
            product: this.props.productState.value,
            productInfo: this.props.productInfo,
            onQtyOrderedChanged: o => {
                this.props.changeQtyOrdered({
                    qtyOrdered: o,
                    productId,
                });
            },
            onUnitOfMeasureChanged: o => {
                this.props.changeUnitOfMeasure({
                    unitOfMeasure: o,
                    productId,
                });
            },
        };

        return (
            <Page data-test-selector={`productDetails_productId_${productId}`}>
                {this.props.selectedProductId && (
                    <CurrentCategory>
                        <ProductContext.Provider value={productContext}>
                            <ParentProductIdContext.Provider value={this.props.parentProductState?.value?.id}>
                                <Zone contentId={this.props.id} zoneName="Content" />
                            </ParentProductIdContext.Provider>
                        </ProductContext.Provider>
                    </CurrentCategory>
                )}
                <Modals />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductDetailsPage),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        supportsProductSelection: true,
        pageType: "System",
        fieldDefinitions: [EnableStructuredPageData, HideHeader, HideFooter],
    },
};

export default pageModule;

/**
 * @deprecated Use string literal "ProductDetailsPage" instead of this constant.
 */
export const ProductDetailsPageContext = "ProductDetailsPage";
