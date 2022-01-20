import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import translate from "@insite/client-framework/Translate";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import Swatch, { SwatchTypeValues } from "@insite/mobius/Swatch";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

interface Props {
    variantSelection: SafeDictionary<string>;
    variantTrait: VariantTraitModel;
    updateVariantSelection: (traitValueId: string, variantTraitId: string) => void;
}

export interface ProductDetailsVariantSwatchDropdownStyles {
    dropdown?: DynamicDropdownPresentationProps;
    labelText?: TypographyPresentationProps;
    swatchWrapper?: InjectableCss;
    swatchCaptionProps?: TypographyPresentationProps;
}

export const variantSwatchDropdownStyles: ProductDetailsVariantSwatchDropdownStyles = {
    dropdown: {
        cssOverrides: {
            dropdownWrapper: css`
                input::placeholder {
                    color: rgb(15, 15, 15);
                }
            `,
        },
    },
    labelText: {
        css: css`
            vertical-align: middle;
            margin-left: 5px;
        `,
    },
    swatchWrapper: {
        css: css`
            display: flex;
            align-content: center;
        `,
    },
    swatchCaptionProps: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
};

const styles = variantSwatchDropdownStyles;

const ProductDetailsVariantSwatchDropdown = ({ variantSelection, updateVariantSelection, variantTrait }: Props) => {
    const updateVariantSelectionSwatchDropdown = (traitValueId?: string) => {
        // DynamicDropdown treats an empty string as null and replaces our optionValue with the OptionText
        // If this happens, we need to send an empty string here.
        if (traitValueId === `${translate("Select")} ${variantTrait.nameDisplay}`) {
            traitValueId = "";
        }

        updateVariantSelection(traitValueId ?? "", variantTrait.id);
    };

    let options: OptionObject[] = [
        {
            optionText: `${translate("Select")} ${variantTrait.nameDisplay}`,
            optionValue: "",
        },
    ];

    options = options.concat(
        variantTrait.traitValues
            ? variantTrait.traitValues.map(traitValue => {
                  return {
                      optionText: traitValue.valueDisplay,
                      optionValue: traitValue.id,
                      disabled: traitValue.isDisabled,
                      rowChildren: (
                          <StyledWrapper {...styles.swatchWrapper} key={traitValue.id} id={traitValue.id}>
                              <Swatch
                                  type={traitValue.swatchType as SwatchTypeValues}
                                  value={
                                      traitValue.swatchType === SwatchTypeValues.Image
                                          ? traitValue.swatchImageValue
                                          : traitValue.swatchColorValue
                                  }
                                  size={35}
                                  caption={traitValue.valueDisplay}
                                  isDisabled={traitValue.isDisabled}
                                  isSelected={variantSelection[variantTrait.id] === traitValue.id}
                                  captionProps={styles.swatchCaptionProps}
                                  onClick={() => updateVariantSelectionSwatchDropdown(traitValue.id)}
                              />
                          </StyledWrapper>
                      ),
                  } as OptionObject;
              })
            : [],
    );

    const placeholderText = variantTrait.unselectedValue
        ? variantTrait.unselectedValue
        : `${translate("Select")} ${variantTrait.nameDisplay}`;
    return (
        <StyledWrapper key={variantTrait.id}>
            <Typography {...styles.labelText}>{variantTrait.nameDisplay}</Typography>
            <DynamicDropdown
                placeholder={placeholderText}
                selectOnly={true}
                {...styles.dropdown}
                options={options}
                selected={variantSelection[variantTrait.id]}
                onSelectionChange={updateVariantSelectionSwatchDropdown}
                uid={variantTrait.id}
            />
        </StyledWrapper>
    );
};

export default ProductDetailsVariantSwatchDropdown;
