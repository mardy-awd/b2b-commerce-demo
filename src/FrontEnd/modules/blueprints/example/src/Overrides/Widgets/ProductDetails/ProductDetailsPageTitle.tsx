import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import ReactPlayer from "react-player";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsPageTitleStyles {
    container?: GridContainerProps;
    brandGridItem?: GridItemProps;
    brandStyles?: ProductBrandStyles;
    titleGridItem?: GridItemProps;
    titleText?: TypographyProps;
}

export const pageTitleStyles: ProductDetailsPageTitleStyles = {
    container: {
        gap: 0,
    },
    brandGridItem: {
        width: 12,
    },
    brandStyles: {
        logoImage: {
            css: css`
                img {
                    max-width: 150px;
                    max-height: 150px;
                }
            `,
        },
        nameText: {
            size: 16,
            weight: "normal",
        },
    },
    titleGridItem: {
        width: 12,
    },
    titleText: {
        variant: "h2",
    },
};

const styles = pageTitleStyles;

const ProductDetailsPageTitle: React.FC<Props> = ({ product }) => {
    return (
        <GridContainer {...styles.container}>
            <h1>This is totally different</h1>
            <ReactPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.titleText}>{product.productTitle}</Typography>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsPageTitle),
    definition: {
        displayName: "Page Title",
        group: "Product Details",
        allowedContexts: ["ProductDetailsPage"],
    },
};

export default widgetModule;
