import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { getQueryStrings } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";

export function getCurrentPromotionsDataView(state: ApplicationState) {
    return getPromotionsDataView(state, API_URL_CURRENT_FRAGMENT);
}

export function getPromotionsDataView(state: ApplicationState, cartId: string | undefined) {
    return getDataView(state.data.promotions, { cartId });
}

export function getOrderPromotions(promotions: PromotionModel[]) {
    return promotions.filter(
        promotion =>
            promotion.promotionResultType === "AmountOffOrder" || promotion.promotionResultType === "PercentOffOrder",
    );
}

export function getShippingPromotions(promotions: PromotionModel[]) {
    return promotions.filter(
        promotion =>
            promotion.promotionResultType === "AmountOffShipping" ||
            promotion.promotionResultType === "PercentOffShipping",
    );
}

export function getReviewAndPayPromotions(state: ApplicationState) {
    const { cartId } = getQueryStrings(state);
    if (cartId) {
        return getPromotionsDataView(state, cartId);
    }
    return getCurrentPromotionsDataView(state);
}

export function getDiscountTotal(promotions: PromotionModel[]) {
    return getOrderPromotions(promotions)
        .concat(getShippingPromotions(promotions))
        .map(promotion => promotion.amount)
        .reduce((prev, curr) => curr + prev, 0);
}
