import { VmiBinStateContext } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Img, { ImgProps } from "@insite/mobius/Img";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface VmiBinDetailsProductInfoStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ImgProps;
    productInfoGridItem?: GridItemProps;
    productInfoGroupContainer?: GridContainerProps;
    productInfoGroupGridItem?: GridItemProps;
    productInfoContainer?: GridContainerProps;
    productDetailsGridItem?: GridItemProps;
    productTitleText?: TypographyProps;
    productText?: TypographyProps;
}

export const vmiBinDetailsProductInfoStyles: VmiBinDetailsProductInfoStyles = {
    container: {
        gap: 20,
        css: css`
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    null,
                ])}
        `,
    },
    productImage: {
        css: css`
            max-width: 145px;
            max-height: 145px;
        `,
    },
    productInfoGridItem: { width: [12, 12, 12, 10, 10] },
    productInfoGroupGridItem: { width: [12, 12, 12, 10, 10] },
    productInfoContainer: {
        offsetCss: css`
            flex-direction: row;
        `,
    },
    productDetailsGridItem: {
        width: [12, 6, 6, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    productTitleText: {
        css: css`
            font-weight: 600;
        `,
    },
    productText: {
        css: css`
            width: 100%;
            word-wrap: break-word;
        `,
    },
};

const styles = vmiBinDetailsProductInfoStyles;

const VmiBinDetailsProductInfo = () => {
    const { value: vmiBin } = useContext(VmiBinStateContext);
    if (!vmiBin?.product) {
        return null;
    }

    const product = vmiBin.product;

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.productImageGridItem}>
                <Img {...styles.productImage} src={product.smallImagePath} altText={product.altText} />
            </GridItem>
            <GridItem {...styles.productInfoGridItem}>
                <GridContainer {...styles.productInfoGroupContainer}>
                    <GridItem {...styles.productInfoGroupGridItem}>
                        <GridContainer {...styles.productInfoContainer}>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Part #")}</Typography>
                                <Typography {...styles.productText}>{product.erpNumber}</Typography>
                            </GridItem>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("My Part #")}</Typography>
                                <Typography {...styles.productText}>{product.customerName}</Typography>
                            </GridItem>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Manufacture Part #")}</Typography>
                                <Typography {...styles.productText}>{product.manufacturerItem}</Typography>
                            </GridItem>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Bin #")}</Typography>
                                <Typography {...styles.productText}>{vmiBin.binNumber}</Typography>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productInfoGroupGridItem}>
                        <GridContainer {...styles.productInfoContainer}>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Quantity")}</Typography>
                                <Typography {...styles.productText}>{vmiBin.lastCountQty}</Typography>
                            </GridItem>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Minimum Quantity")}</Typography>
                                <Typography {...styles.productText}>{vmiBin.minimumQty}</Typography>
                            </GridItem>
                            <GridItem {...styles.productDetailsGridItem}>
                                <Typography {...styles.productTitleText}>{translate("Maximum Quantity")}</Typography>
                                <Typography {...styles.productText}>{vmiBin.maximumQty}</Typography>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: VmiBinDetailsProductInfo,
    definition: {
        allowedContexts: ["VmiBinDetailsPage"],
        group: "VMI Bin Details",
    },
};

export default widgetModule;
