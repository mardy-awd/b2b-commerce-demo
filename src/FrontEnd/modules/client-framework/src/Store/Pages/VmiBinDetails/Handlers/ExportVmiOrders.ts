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

export const DispatchBeginExportVmiOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/BeginExportVmiOrders",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data = [];
    const state = props.getState();
    const language = state.context.session.language;

    const prepareData = (row: OrderModel) => {
        return [
            row.webOrderNumber || row.erpOrderNumber,
            row.status,
            row.orderDate &&
                getLocalizedDateTime({
                    dateTime: new Date(row.orderDate),
                    language,
                }),
        ];
    };

    if (Object.keys(props.parameter.ids).length) {
        const vmiOrdersDataView = getOrdersDataView(state, state.pages.vmiBinDetails.getVmiOrdersParameter);
        if (vmiOrdersDataView.value) {
            for (const row of vmiOrdersDataView.value) {
                if (props.parameter.ids[row.id]) {
                    data.push(prepareData(row));
                }
            }
        }
    } else {
        const apiResult = await getOrders({
            ...state.pages.vmiBinDetails.getVmiOrdersParameter,
            page: 1,
            pageSize: 9999,
        });
        if (apiResult.orders) {
            for (const row of apiResult.orders) {
                data.push(prepareData(row));
            }
        }
    }

    const documentData = {
        fields: [translate("Order Number"), translate("Status"), translate("Order Date")],
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `orders_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportVmiOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/CompleteExportVmiOrders",
    });
};

export const chain = [DispatchBeginExportVmiOrders, ExportData, DispatchCompleteExportVmiOrders];

const exportVmiOrders = createHandlerChainRunner(chain, "ExportVmiOrders");
export default exportVmiOrders;
