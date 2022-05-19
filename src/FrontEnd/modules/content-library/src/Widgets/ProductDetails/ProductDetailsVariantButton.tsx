import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import translate from "@insite/client-framework/Translate";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

interface Props {
    variantSelection: SafeDictionary<string>;
    variantTrait: VariantTraitModel;
    updateVariantSelection: (traitValueId: string, variantTraitId: string) => void;
}

export interface ProductDetailsVariantButtonStyles {
    wrapper?: InjectableCss;
    swatchHeader?: InjectableCss;
    button?: ButtonPresentationProps;
    labelText?: TypographyPresentationProps;
    link?: LinkPresentationProps;
}

export const variantButtonsStyles: ProductDetailsVariantButtonStyles = {
    wrapper: {
        css: css`
            margin-top: 10px;
        `,
    },
    swatchHeader: {
        css: css`
            display: flex;
            justify-content: space-between;
            align-items: center;
        `,
    },
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
    link: {
        css: css`
            margin: 5px;
            white-space: nowrap;
        `,
    },
};

const styles = variantButtonsStyles;

const ProductDetailsVariantButton = ({ variantSelection, updateVariantSelection, variantTrait }: Props) => {
    return (
        <StyledWrapper {...styles.wrapper} key={variantTrait.id}>
            <StyledWrapper {...styles.swatchHeader}>
                <Typography {...styles.labelText}>{variantTrait.nameDisplay}</Typography>
                <Link
                    {...styles.link}
                    onClick={() => {
                        updateVariantSelection("", variantTrait.id);
                    }}
                >
                    {translate("Clear Selection")}
                </Link>
            </StyledWrapper>
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
