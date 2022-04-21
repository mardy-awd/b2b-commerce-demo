import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadOrders from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrders";
import { getOrdersDataView } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import { AccordionSectionPresentationProps, ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    ordersDataView: getOrdersDataView(state, recentOrdersParameter),
});

const mapDispatchToProps = {
    loadOrders,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiDashboardRecentNotesStyles {
    ordersAccordion?: AccordionPresentationProps;
    ordersAccordionSection?: AccordionSectionPresentationProps;
    ordersGridContainer?: GridContainerProps;
    orderGridItem?: GridItemProps;
    vmiLocationNameText?: TypographyPresentationProps;
    orderDateText?: TypographyPresentationProps;
    notesText?: TypographyPresentationProps;
    noOrdersFoundGridItem?: GridItemProps;
    noOrdersFoundText?: TypographyPresentationProps;
}

export const vmiDashboardRecentNotesStyles: VmiDashboardRecentNotesStyles = {
    ordersAccordionSection: {
        titleTypographyProps: {
            css: css`
                margin-left: auto;
                margin-right: auto;
                font-style: normal;
            `,
        },
    },
    orderGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    vmiLocationNameText: {
        css: css`
            font-weight: bold;
        `,
    },
    notesText: {
        css: css`
            margin-top: 2px;
        `,
    },
    noOrdersFoundGridItem: { width: 12 },
};

const recentOrdersParameter: GetOrdersApiParameter = {
    page: 1,
    pageSize: 5,
    sort: "OrderDate DESC",
    customerSequence: "-1",
    vmiOrdersOnly: true,
    expand: ["vmidetails"],
};

const styles = vmiDashboardRecentNotesStyles;

const VmiDashboardRecentNotes = ({ ordersDataView, loadOrders }: Props) => {
    useEffect(() => {
        loadOrders(recentOrdersParameter);
    }, []);

    if (!ordersDataView.value) {
        return null;
    }

    return (
        <Accordion {...styles.ordersAccordion} headingLevel={2}>
            <ManagedAccordionSection title={translate("Recent Notes")} {...styles.ordersAccordionSection}>
                <GridContainer {...styles.ordersGridContainer}>
                    {ordersDataView.value.map(order => (
                        <GridItem {...styles.orderGridItem} key={`${order.id}`}>
                            <Typography {...styles.vmiLocationNameText} as="h3">
                                {order.vmiLocationName}
                            </Typography>
                            <OrderDetailPageTypeLink
                                title={order.webOrderNumber}
                                orderNumber={order.webOrderNumber || order.erpOrderNumber}
                            />
                            <Typography {...styles.notesText}>{order.notes}</Typography>
                            <Typography {...styles.orderDateText}>
                                <LocalizedDateTime
                                    dateTime={order.orderDate}
                                    options={{ year: "numeric", month: "numeric", day: "numeric" }}
                                />
                            </Typography>
                        </GridItem>
                    ))}
                    {ordersDataView.value.length === 0 && (
                        <GridItem {...styles.noOrdersFoundGridItem}>
                            <Typography {...styles.noOrdersFoundText}>{translate("No orders found")}</Typography>
                        </GridItem>
                    )}
                </GridContainer>
            </ManagedAccordionSection>
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiDashboardRecentNotes),
    definition: {
        displayName: "Recent Notes",
        group: "VMI Dashboard",
        allowedContexts: ["VmiDashboardPage"],
    },
};

export default widgetModule;
