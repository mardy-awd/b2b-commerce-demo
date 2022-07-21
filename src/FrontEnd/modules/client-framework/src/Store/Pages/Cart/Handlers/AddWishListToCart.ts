import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    addWishListToCart as addWishListToCartApi,
    AddWishListToCartApiParameter,
} from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = {
    apiParameter: AddWishListToCartApiParameter;
} & HasOnSuccess<CartLineCollectionModel>;

type Props = {
    apiParameter: AddWishListToCartApiParameter;
    apiResult: CartLineCollectionModel;
};

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter.apiParameter;
};

export const DispatchBeginAddingProductToCart: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginUpdatingCart",
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await addWishListToCartApi(props.apiParameter);
};

export const DispatchCompleteAddingProductToCart: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteUpdatingCart",
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const DispatchResetPromotionsData: HandlerType = props => {
    props.dispatch({
        type: "Data/Promotions/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginAddingProductToCart,
    RequestDataFromApi,
    DispatchCompleteAddingProductToCart,
    LoadCart,
    DispatchResetPromotionsData,
    ExecuteOnSuccessCallback,
];

export const addWishListToCart = createHandlerChainRunner(chain, "AddWishListToCart");
export default addWishListToCart;
