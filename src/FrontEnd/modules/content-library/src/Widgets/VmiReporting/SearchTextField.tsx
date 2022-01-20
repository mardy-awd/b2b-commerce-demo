import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import getAutocompleteModel from "@insite/client-framework/Store/CommonHandlers/GetAutocompleteModel";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    filter: state.pages.vmiReporting.getVmiBinsParameter.filter,
});

const mapDispatchToProps = {
    getAutocompleteModel,
    updateSearchFields,
};

export interface SearchProductFieldStyles {
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
    optionWrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
    productImage?: LazyImageProps;
    infoWrapper?: InjectableCss;
    autocompleteTitleText?: TypographyPresentationProps;
    autocompleteErpText?: TypographyPresentationProps;
}

export const searchProductFieldStyles: SearchProductFieldStyles = {
    optionWrapper: {
        css: css`
            display: flex;
            cursor: pointer;
        `,
    },
    imageWrapper: {
        css: css`
            display: flex;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        `,
    },
    productImage: {
        width: "50px",
        css: css`
            flex-shrink: 0;
            img {
                height: 100%;
            }
        `,
    },
    infoWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
    autocompleteTitleText: {
        size: 14,
    },
    autocompleteErpText: {
        size: 14,
        css: css`
            margin-top: 5px;
        `,
    },
};
const styles = searchProductFieldStyles;

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const SearchProductField = ({ filter, getAutocompleteModel, updateSearchFields }: Props) => {
    const [options, setOptions] = useState<OptionObject[]>([]);

    const onSelectionChangeHandler = (value?: string) => {
        updateSearchFields({ filter: value });
    };

    const debouncedSearchProducts = debounce((query: string) => {
        getAutocompleteModel({
            query,
            onSuccess: result => {
                if (!result?.products) {
                    return;
                }

                const newOptions = result.products.map(product => ({
                    optionText: product.erpNumber,
                    optionValue: product.erpNumber || undefined,
                    rowChildren: (
                        <StyledWrapper {...styles.optionWrapper}>
                            <StyledWrapper {...styles.imageWrapper}>
                                <LazyImage {...styles.productImage} src={product.image} />
                            </StyledWrapper>
                            <StyledWrapper {...styles.infoWrapper}>
                                <Typography {...styles.autocompleteTitleText}>{product.title}</Typography>
                                <Typography {...styles.autocompleteErpText}>{product.erpNumber}</Typography>
                            </StyledWrapper>
                        </StyledWrapper>
                    ),
                }));

                setOptions(newOptions);
            },
            onComplete(resultProps) {
                if (resultProps?.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps?.apiResult);
                }
            },
        });
    }, 300);

    const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedSearchProducts(event.target.value);
    };

    return (
        <DynamicDropdown
            {...styles.searchDynamicDropdown}
            label={translate("Product")}
            onSelectionChange={onSelectionChangeHandler}
            onInputChange={onInputChanged}
            filterOption={() => true}
            selected={filter}
            options={options}
            placeholder={translate("Enter keyword or item #")}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchProductField);
