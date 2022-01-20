import { SafeDictionary } from "@insite/client-framework/Common/Types";
import translate from "@insite/client-framework/Translate";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import React from "react";
import { css } from "styled-components";

interface Props {
    variantSelection: SafeDictionary<string>;
    variantTrait: VariantTraitModel;
    updateVariantSelection: (traitValueId: string, variantTraitId: string) => void;
}

export interface ProductDetailsVariantDropdownStyles {
    select?: SelectPresentationProps;
}

export const productDetailsVariantDropdownStyles: ProductDetailsVariantDropdownStyles = {
    select: {
        cssOverrides: {
            formField: css`
                margin-top: 10px;
            `,
        },
    },
};

const styles = productDetailsVariantDropdownStyles;

const ProductDetailsVariantDropdown = ({ variantSelection, updateVariantSelection, variantTrait }: Props) => {
    return (
        <Select
            {...styles.select}
            key={variantTrait.id}
            label={variantTrait.nameDisplay}
            value={variantSelection[variantTrait.id]}
            onChange={event => {
                updateVariantSelection(event.currentTarget.value, variantTrait.id);
            }}
            data-test-selector={`styleSelect_${variantTrait.name}`}
        >
            <option value="" key={variantTrait.id}>
                {variantTrait.unselectedValue
                    ? variantTrait.unselectedValue
                    : `${translate("Select")} ${variantTrait.nameDisplay}`}
            </option>
            {variantTrait.traitValues?.map(traitValue => (
                <option value={`${traitValue.id}`} key={`${traitValue.id}`} disabled={traitValue.isDisabled}>
                    {traitValue.valueDisplay}
                </option>
            ))}
        </Select>
    );
};

export default ProductDetailsVariantDropdown;
