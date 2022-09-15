import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { SuggestionModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link from "@insite/mobius/Link";
import Typography from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const productsDataView = getProductListDataView(state);
    if (productsDataView.value) {
        return {
            loaded: true,
            searchPath: getSettingsCollection(state).searchSettings.searchPath,
            didYouMeanSuggestions: productsDataView.didYouMeanSuggestions,
            correctedQuery: productsDataView.correctedQuery,
            originalQuery: productsDataView.originalQuery,
        };
    }
    return {
        loaded: false,
        searchPath: "",
        didYouMeanSuggestions: [] as SuggestionModel[],
        correctedQuery: "",
        originalQuery: "",
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface ProductListSuggestionStyles {
    wrapper?: InjectableCss;
}

export const suggestionStyles: ProductListSuggestionStyles = {};

const styles = suggestionStyles;

const ProductListSuggestion = ({ loaded, searchPath, didYouMeanSuggestions, originalQuery, correctedQuery }: Props) => {
    if (!loaded) {
        return null;
    }
    return (
        <StyledWrapper {...styles.wrapper}>
            {didYouMeanSuggestions && didYouMeanSuggestions.length > 0 && (
                <>
                    <Typography>{translate("Did you mean ")}</Typography>
                    <Link href={`/${searchPath}?query=${didYouMeanSuggestions[0].suggestion}`}>
                        {didYouMeanSuggestions[0].suggestion}
                    </Link>
                </>
            )}
            {correctedQuery && originalQuery !== correctedQuery && (
                <>
                    <Typography>{translate("Search instead for ")}</Typography>
                    <Link
                        href={`/${searchPath}?query=${originalQuery}&includeSuggestions=false`}
                        data-test-selector="productListOriginalQuery"
                    >
                        {originalQuery}
                    </Link>
                </>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ProductListSuggestion),
    definition: {
        group: "Product List",
        displayName: "Suggestion",
        allowedContexts: ["ProductListPage"],
    },
};

export default widgetModule;
