import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface Props {
    variantSelection: SafeDictionary<string>;
    variantTrait: VariantTraitModel;
    updateVariantSelection: (traitValueId: string, variantTraitId: string) => void;
}

export interface ProductDetailsVariantButtonStyles {
    button?: ButtonPresentationProps;
    labelText?: TypographyPresentationProps;
}

export const variantButtonsStyles: ProductDetailsVariantButtonStyles = {
    button: {
        css: css`
            margin-right: 5px;
            margin-top: 5px;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `,
        hoverAnimation: "grow",
    },
    labelText: {
        css: css`
            display: inline-block;
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 5px;
        `,
    },
};

const styles = variantButtonsStyles;

const ProductDetailsVariantButton = ({ variantSelection, updateVariantSelection, variantTrait }: Props) => {
    return (
        <StyledWrapper key={variantTrait.id}>
            <Typography {...styles.labelText}>{variantTrait.nameDisplay}</Typography>
            {variantTrait.traitValues?.map(traitValue => (
                <Button
                    {...styles.button}
                    variant={variantSelection[variantTrait.id] === traitValue.id ? "primary" : "secondary"}
                    buttonType={variantSelection[variantTrait.id] === traitValue.id ? "solid" : "outline"}
                    value={`${traitValue.id}`}
                    key={`${traitValue.id}`}
                    disabled={traitValue.isDisabled}
                    onClick={event => updateVariantSelection(event.currentTarget.value, variantTrait.id)}
                >
                    {traitValue.valueDisplay}
                </Button>
            ))}
        </StyledWrapper>
    );
};

export default ProductDetailsVariantButton;
