import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { OrderModel, OrderSettingsModel } from "@insite/client-framework/Types/ApiModels";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

interface OwnProps {
    order: OrderModel;
    orderSettings: OrderSettingsModel;
    extendedStyles?: OrderSummaryCardStyles;
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface OrderSummaryCardStyles {
    orderSummaryCardGridItem?: GridItemProps;
    container?: GridContainerProps;
    pageTypeLinkGridItem?: GridItemProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberHeadingAndText?: SmallHeadingAndTextStyles;
    statusGridItem?: GridItemProps;
    statusHeadingAndText?: SmallHeadingAndTextStyles;
    webOrderNumberGridItem?: GridItemProps;
    webOrderNumberHeadingAndText?: SmallHeadingAndTextStyles;
    totalGridItem?: GridItemProps;
    totalHeadingAndText?: SmallHeadingAndTextStyles;
}

export const orderSummaryCardStyles: OrderSummaryCardStyles = {
    orderSummaryCardGridItem: {
        width: 12,
        css: css`
            padding: 0 20px;
            max-width: 500px;
        `,
    },
    container: { gap: 5 },
    pageTypeLinkGridItem: { width: 12 },
    orderNumberGridItem: { width: 6 },
    statusGridItem: { width: 6 },
    webOrderNumberGridItem: { width: 6 },
    totalGridItem: { width: 6 },
};

const OrderSummaryCard: FC<Props> = ({ language, order, orderSettings, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(orderSummaryCardStyles, extendedStyles));

    const orderDateDisplay = getLocalizedDateTime({
        dateTime: order.orderDate,
        language,
        options: {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        },
    });
    const orderNumber = order.erpOrderNumber || order.webOrderNumber;

    return (
        <GridItem className="order-summary-card-grid-item" {...styles.orderSummaryCardGridItem}>
            <GridContainer
                className="order-summary-card-container"
                {...styles.container}
                data-test-selector={`orderSummaryCard_${orderNumber}`}
            >
                <GridItem
                    className="page-type-link-grid-item"
                    {...styles.pageTypeLinkGridItem}
                    data-test-selector="orderSummaryCard_Date"
                >
                    {orderNumber && <OrderDetailPageTypeLink title={orderDateDisplay} orderNumber={orderNumber} />}
                </GridItem>
                <GridItem className="order-number-grid-item" {...styles.orderNumberGridItem}>
                    {order.erpOrderNumber && (
                        <SmallHeadingAndText
                            heading={translate("Order #")}
                            text={order.erpOrderNumber}
                            extendedStyles={styles.orderNumberHeadingAndText}
                        />
                    )}
                </GridItem>
                <GridItem className="status-grid-item" {...styles.statusGridItem}>
                    {order.statusDisplay && (
                        <SmallHeadingAndText
                            heading={translate("Status")}
                            text={order.statusDisplay}
                            extendedStyles={styles.statusHeadingAndText}
                        />
                    )}
                </GridItem>
                {orderSettings.showWebOrderNumber && order.webOrderNumber && (
                    <GridItem className="web-order-number-grid-item" {...styles.webOrderNumberGridItem}>
                        <SmallHeadingAndText
                            heading={translate("Web Order #")}
                            text={order.webOrderNumber}
                            extendedStyles={styles.webOrderNumberHeadingAndText}
                        />
                    </GridItem>
                )}
                <GridItem className="total-grid-item" {...styles.totalGridItem}>
                    {order.orderGrandTotalDisplay && (
                        <SmallHeadingAndText
                            heading={translate("Total")}
                            text={order.orderGrandTotalDisplay}
                            extendedStyles={styles.totalHeadingAndText}
                        />
                    )}
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

export default connect(mapStateToProps)(OrderSummaryCard);
