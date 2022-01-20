import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
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
    variantSelection: SafeDictionary<string>;
    variantTrait: VariantTraitModel;
    updateVariantSelection: (traitValueId: string, variantTraitId: string) => void;
}

export interface ProductDetailsVariantListStyles {
    labelText?: TypographyPresentationProps;
    link?: LinkPresentationProps;
    labelWrapper?: InjectableCss;
    swatchClickable?: ClickablePresentationProps;
    swatchCaptionProps?: InjectableCss;
}

export const variantListStyles: ProductDetailsVariantListStyles = {
    labelText: {
        css: css`
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 5px;
        `,
    },
    labelWrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
            align-items: center;
        `,
    },
    swatchClickable: {
        css: css`
            width: 100%;
        `,
    },
    link: {
        css: css`
            margin: 10px 5px;
        `,
    },
    swatchCaptionProps: {
        css: css`
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        `,
    },
};

const SwatchListDisplayItem = styled.li`
    display: inline-block;
    width: 90%;
    margin: 10px 5px;
`;

export const UnorderedList = styled.ul<InjectableCss>`
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    ${injectCss}
`;

const styles = variantListStyles;

const ProductDetailsVariantSwatchList = ({ variantSelection, updateVariantSelection, variantTrait }: Props) => {
    const updateVariantSelectionSwatchList = (traitValueId?: string) => {
        updateVariantSelection(traitValueId ?? "", variantTrait.id);
    };

    const CreateSwatchListItem = (traitValue: TraitValueModel) => {
        return (
            <SwatchListDisplayItem key={traitValue.id}>
                <Clickable
                    onClick={() => updateVariantSelectionSwatchList(traitValue.id)}
                    disabled={traitValue.isDisabled}
                    {...styles.swatchClickable}
                >
                    <Swatch
                        type={traitValue.swatchType as SwatchTypeValues}
                        value={
                            traitValue.swatchType === SwatchTypeValues.Image
                                ? traitValue.swatchImageValue
                                : traitValue.swatchColorValue
                        }
                        size={35}
                        caption={variantTrait.displayTextWithSwatch ? traitValue.valueDisplay : undefined}
                        isDisabled={traitValue.isDisabled}
                        captionProps={styles.swatchCaptionProps}
                        isSelected={variantSelection[variantTrait.id] === traitValue.id}
                    />
                </Clickable>
            </SwatchListDisplayItem>
        );
    };

    return (
        <StyledWrapper key={variantTrait.id}>
            <StyledWrapper {...styles.labelWrapper}>
                <Typography {...styles.labelText}>{variantTrait.nameDisplay}</Typography>
                <Link {...styles.link} onClick={() => updateVariantSelectionSwatchList("")}>
                    {translate("Clear Selection")}
                </Link>
            </StyledWrapper>
            <UnorderedList>
                {variantTrait.traitValues?.map(traitValue => CreateSwatchListItem(traitValue))}
            </UnorderedList>
        </StyledWrapper>
    );
};

export default ProductDetailsVariantSwatchList;
