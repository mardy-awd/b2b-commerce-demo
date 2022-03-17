import { SafeDictionary } from "@insite/client-framework/Common/Types";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getOrders } from "@insite/client-framework/Services/OrderService";
import { getOrdersDataView } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    ids: SafeDictionary<boolean>;
}>;

export const DispatchBeginExportOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/BeginExportOrders",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data: any[] = [];
    const state = props.getState();
    const language = state.context.session.language;
    const orderData = (order: OrderModel) => {
        return [
            order.webOrderNumber || order.erpOrderNumber,
            order.orderDate &&
                getLocalizedDateTime({
                    dateTime: new Date(order.orderDate),
                    language,
                }),
            order.orderGrandTotalDisplay,
            order.statusDisplay,
            `${order.stCompanyName} ${order.stAddress1} ${order.stAddress2} ${order.shipToCity} ${order.shipToState}`,
            order.customerPO,
        ];
    };

    if (Object.keys(props.parameter.ids).length) {
        const ordersDataView = getOrdersDataView(state, state.pages.orderHistory.getOrdersParameter);
        if (ordersDataView.value) {
            ordersDataView.value.forEach(order => {
                if (props.parameter.ids[order.id]) {
                    data.push(orderData(order));
                }
            });
        }
    } else {
        const orderResult = await getOrders({
            ...state.pages.orderHistory.getOrdersParameter,
            page: 1,
            pageSize: 9999,
        });
        if (orderResult && orderResult.orders) {
            orderResult.orders.forEach(order => {
                data.push(orderData(order));
            });
        }
    }

    const documentData = {
        fields: [
            translate("Order #"),
            translate("Date"),
            translate("Order Total"),
            translate("Status"),
            translate("Ship To / Pick Up"),
            translate("PO #"),
        ],
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `order_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/CompleteExportOrders",
    });
};

export const chain = [DispatchBeginExportOrders, ExportData, DispatchCompleteExportOrders];

const exportOrders = createHandlerChainRunner(chain, "ExportOrders");
export default exportOrders;
