import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import * as React from "react";

interface Props extends WidgetProps, HasCategoryContext {}

export interface CategoryImageStyles {
    image?: LazyImageProps;
}

export const categoryImageStyles: CategoryImageStyles = {};

const CategoryImage: React.FC<Props> = ({ category }) => {
    if (!category) {
        return null;
    }

    return <LazyImage src={category.largeImagePath} altText={category.imageAltText} {...categoryImageStyles.image} />;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryImage),
    definition: {
        group: "Categories",
        icon: "Image",
    },
};

export default widgetModule;
