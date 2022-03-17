import useFilteredVariantTraits from "@insite/client-framework/Common/Hooks/useFilteredVariantTraits";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasParentProductId, withParentProductId } from "@insite/client-framework/Components/ParentProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getProductState,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import updateVariantSelection from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/UpdateVariantSelection";
import { VariantDisplayTypeValues, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import ProductDetailsVariantButton from "@insite/content-library/Widgets/ProductDetails/ProductDetailsVariantButton";
import ProductDetailsVariantDropdown from "@insite/content-library/Widgets/ProductDetails/ProductDetailsVariantDropdown";
import ProductDetailsVariantSwatchDropdown from "@insite/content-library/Widgets/ProductDetails/ProductDetailsVariantSwatchDropdown";
import ProductDetailsVariantSwatchGrid from "@insite/content-library/Widgets/ProductDetails/ProductDetailsVariantSwatchGrid";
import ProductDetailsVariantSwatchList from "@insite/content-library/Widgets/ProductDetails/ProductDetailsVariantSwatchList";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasParentProductId;

const mapStateToProps = (state: ApplicationState, ownProps: HasParentProductId) => ({
    variantTraits: getProductState(state, ownProps.parentProductId).value?.variantTraits,
    variantChildren: getVariantChildrenDataView(state, ownProps.parentProductId).value,
    variantSelection: state.pages.productDetails.variantSelection,
    variantSelectionCompleted: state.pages.productDetails.variantSelectionCompleted,
    variantProductState: getProductState(state, state.pages.productDetails.selectedProductId),
    selectedProductId: state.pages.productDetails.selectedProductId,
});

const mapDispatchToProps = {
    updateVariantSelection,
};

export interface ProductDetailsVariantOptionsStyles {
    wrapper?: InjectableCss;
}

export const variantOptionsStyles: ProductDetailsVariantOptionsStyles = {
    wrapper: {
        css: css`
            width: 100%;
        `,
    },
};

const styles = variantOptionsStyles;

const ProductDetailsVariantOptions: React.FC<Props> = ({
    variantChildren,
    variantSelection,
    updateVariantSelection,
    variantTraits,
    parentProductId,
    variantProductState,
    selectedProductId,
}) => {
    useEffect(() => {
        let newUrl = window.location.href.split("?option=")[0];
        if (variantProductState.value && variantProductState.value.isVariantParent) {
            window.history.replaceState(null, "", newUrl);
        } else if (variantProductState.value && variantProductState.value.childTraitValues) {
            newUrl = newUrl.concat("?option=", variantProductState.value.urlSegment);
            window.history.replaceState(null, "", newUrl);
        }
    }, [selectedProductId]);

    const variantChangeHandler = (traitValueId: string, variantTraitId: string) => {
        updateVariantSelection({ traitValueId, variantTraitId, productId: parentProductId });
    };

    if (!variantTraits || variantTraits.length === 0 || !variantChildren) {
        return null;
    }

    const filteredVariantTraits = useFilteredVariantTraits(variantTraits, variantChildren, variantSelection, true);

    const renderVariant = (variantTrait: VariantTraitModel) => {
        switch (variantTrait.displayType) {
            case VariantDisplayTypeValues.Button:
                return (
                    <ProductDetailsVariantButton
                        key={variantTrait.id}
                        variantSelection={variantSelection}
                        updateVariantSelection={variantChangeHandler}
                        variantTrait={variantTrait}
                    />
                );
            case VariantDisplayTypeValues.SwatchDropdown:
                return (
                    <ProductDetailsVariantSwatchDropdown
                        key={variantTrait.id}
                        variantSelection={variantSelection}
                        updateVariantSelection={variantChangeHandler}
                        variantTrait={variantTrait}
                    />
                );
            case VariantDisplayTypeValues.SwatchGrid:
                return (
                    <ProductDetailsVariantSwatchGrid
                        key={variantTrait.id}
                        variantSelection={variantSelection}
                        updateVariantSelection={variantChangeHandler}
                        variantTrait={variantTrait}
                    />
                );
            case VariantDisplayTypeValues.SwatchList:
                return (
                    <ProductDetailsVariantSwatchList
                        key={variantTrait.id}
                        variantSelection={variantSelection}
                        updateVariantSelection={variantChangeHandler}
                        variantTrait={variantTrait}
                    />
                );
            default:
                return (
                    <ProductDetailsVariantDropdown
                        key={variantTrait.id}
                        variantSelection={variantSelection}
                        updateVariantSelection={variantChangeHandler}
                        variantTrait={variantTrait}
                    />
                );
        }
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            {filteredVariantTraits.map(
                variantTrait => !!variantTrait.traitValues?.length && renderVariant(variantTrait as VariantTraitModel),
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withParentProductId(connect(mapStateToProps, mapDispatchToProps)(ProductDetailsVariantOptions)),
    definition: {
        group: "Product Details",
        allowedContexts: ["ProductDetailsPage"],
    },
};

export default widgetModule;
