import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getReviewAndPayCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import { getQueryStrings } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { getReviewAndPayPromotions } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import clearMessages from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/ClearMessages";
import loadDataIfNeeded from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/LoadDataIfNeeded";
import setCartId from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetCartId";
import setPlaceOrderErrorMessage from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetPlaceOrderErrorMessage";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddressErrorModal from "@insite/content-library/Components/AddressErrorModal";
import Page from "@insite/mobius/Page";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    setCartId,
    loadCurrentCart,
    loadCurrentPromotions,
    loadCurrentCountries,
    setPlaceOrderErrorMessage,
    loadDataIfNeeded,
    clearMessages,
};

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = getQueryStrings(state);
    const cartState = getReviewAndPayCartState(state);
    const promotionsDataView = getReviewAndPayPromotions(state);

    const isLoadDataNeeded =
        (!cartState.value && !cartState.isLoading) || (!promotionsDataView.value && !promotionsDataView.isLoading);

    return {
        cartId,
        isLoadDataNeeded: isLoadDataNeeded || !getCurrentCountries(state),
    };
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class CheckoutReviewAndSubmitPage extends Component<Props> {
    componentDidMount() {
        this.props.setCartId({ cartId: this.props.cartId });

        if (this.props.isLoadDataNeeded) {
            this.props.loadDataIfNeeded({ cartId: this.props.cartId });
        }

        this.props.setPlaceOrderErrorMessage({});
        this.props.clearMessages();
    }

    render() {
        return (
            <Page data-test-selector="checkoutReviewAndSubmitPage">
                <Zone zoneName="Content" contentId={this.props.id} />
                <AddressErrorModal />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

/**
 * @deprecated Use string literal "CheckoutReviewAndSubmitPage" instead of this constant.
 */
export const CheckoutReviewAndSubmitPageContext = "CheckoutReviewAndSubmitPage";
