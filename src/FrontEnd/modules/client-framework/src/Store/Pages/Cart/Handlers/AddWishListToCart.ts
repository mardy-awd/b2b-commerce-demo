import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { addWishListToCart as addWishListToCartApi, AddWishListToCartApiParameter } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType =
    ApiHandlerDiscreteParameter<{
        apiParameter: AddWishListToCartApiParameter;
        onSuccess?: () => void;
    }, AddWishListToCartApiParameter, CartLineCollectionModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter.apiParameter;
};

export const RequestDataFromApi: HandlerType =  async props => {
    props.apiResult = await addWishListToCartApi(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    LoadCart,
    ExecuteOnSuccessCallback,
];

export const addWishListToCart = createHandlerChainRunner(chain, "AddWishListToCart");
export default addWishListToCart;
