import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import { TraitValueModel, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Swatch, { SwatchTypeValues } from "@insite/mobius/Swatch";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { injectCss } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import styled, { css } from "styled-components";

interface Props {
    product: ProductContextModel;
    variantTrait: VariantTraitModel;
}

export interface ProductListVariantSwatchStyles {
    container?: InjectableCss;
    swatchClickable?: ClickablePresentationProps;
    labelText?: TypographyPresentationProps;
    labelWrapper?: InjectableCss;
    productDetailLink?: LinkPresentationProps;
}

export const productListVariantSwatchStyles: ProductListVariantSwatchStyles = {
    container: {
        css: css`
            min-width: 100%;
        `,
    },
    swatchClickable: {
        css: css`
            width: 100%;
            display: flex;
            flex-direction: column;
        `,
    },
    labelText: {
        css: css`
            font-size: 15px;
            font-weight: 600;
        `,
    },
    labelWrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
            align-items: center;
        `,
    },
};

const SwatchGridDisplayItem = styled.li`
    display: inline-block;
    text-align: center;
`;

const SwatchGridDisplayViewMore = styled.li`
    display: inline-block;
    text-align: center;
    margin: 10px 5px 14px 5px;
`;

export const UnorderedList = styled.ul<InjectableCss>`
    overflow-y: auto;
    max-height: 300px;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
    width: 100%;
    ${injectCss}
`;

const styles = productListVariantSwatchStyles;

const ProductListVariantSwatch = ({ product, variantTrait }: Props) => {
    const CreateSwatchGrid = (traitValue: TraitValueModel) => {
        return (
            <SwatchGridDisplayItem
                key={traitValue.id}
                title={traitValue.valueDisplay ? traitValue.valueDisplay : undefined}
            >
                <Swatch
                    type={traitValue.swatchType as SwatchTypeValues}
                    value={
                        traitValue.swatchType === SwatchTypeValues.Image
                            ? traitValue.swatchImageValue
                            : traitValue.swatchColorValue
                    }
                    size={20}
                    isDisabled={traitValue.isDisabled}
                    isSelected={traitValue.isDefault}
                />
            </SwatchGridDisplayItem>
        );
    };

    const ViewMoreLink = (product: ProductContextModel) => {
        const productDetailPath = product.productInfo.productDetailPath;

        return (
            <SwatchGridDisplayViewMore data-test-selector="swatch_viewMore">
                <Link
                    {...styles.productDetailLink}
                    href={productDetailPath}
                    alt={translate("View More Swatches")}
                    data-test-selector="swatch_ProductDescriptionLink"
                >
                    {translate("View More")}
                </Link>
            </SwatchGridDisplayViewMore>
        );
    };

    return (
        <StyledWrapper
            key={variantTrait.id}
            data-test-selector="swatch_productListProductSwatchList"
            {...styles.container}
        >
            <StyledWrapper {...styles.labelWrapper}>
                <Typography {...styles.labelText}>{variantTrait.nameDisplay}</Typography>
            </StyledWrapper>
            <UnorderedList>
                {variantTrait.traitValues
                    ?.slice(0, variantTrait.numberOfSwatchesVisible)
                    .map(traitValue => CreateSwatchGrid(traitValue))}
                {variantTrait &&
                    variantTrait.traitValues &&
                    variantTrait.numberOfSwatchesVisible < variantTrait.traitValues?.length &&
                    ViewMoreLink(product)}
            </UnorderedList>
        </StyledWrapper>
    );
};

export default ProductListVariantSwatch;
