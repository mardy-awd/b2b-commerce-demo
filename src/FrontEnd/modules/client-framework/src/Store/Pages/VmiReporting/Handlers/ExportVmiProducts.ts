import { SafeDictionary } from "@insite/client-framework/Common/Types";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getVmiBins } from "@insite/client-framework/Services/VmiBinsService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getVmiBinsDataView } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import { getWidgetsByPageId } from "@insite/client-framework/Store/Data/Widgets/WidgetSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { VmiBinModel } from "@insite/client-framework/Types/ApiModels";
// eslint-disable-next-line spire/fenced-imports
import { VmiBinsTableProps } from "@insite/content-library/Widgets/VmiReporting/VmiBinsTable";

type HandlerType = Handler<{
    ids: SafeDictionary<boolean>;
}>;

export const DispatchBeginExportVmiProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiReporting/BeginExportVmiProducts",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data = [];
    const state = props.getState();
    const language = state.context.session.language;
    const url: { protocol: string; host: string } = window.location;
    const authority = `${url.protocol}//${url.host}`;
    const currentPage = getCurrentPage(state);
    const pageWidgets = getWidgetsByPageId(state, currentPage.id);
    const orderDetailsPageLink = getPageLinkByPageType(state, "OrderDetailsPage");
    const tableWidget = pageWidgets?.find(o => o.type === "VmiReporting/VmiBinsTable");
    const vmiBinsTable = tableWidget && (tableWidget as VmiBinsTableProps);
    const fields = vmiBinsTable?.fields;

    const prepareData = (row: VmiBinModel) => {
        const data: (string | number | null | undefined)[] = [row.product.shortDescription, row.product.erpNumber];
        const orderNumber = row.lastOrderErpOrderNumber || row.lastOrderWebOrderNumber;

        fields?.showManufacturerItem && data.push(row.product.manufacturerItem);
        fields?.showCustomerName && data.push(row.product.customerName);
        fields?.showBinNumber && data.push(row.binNumber);
        data.push(row.minimumQty);
        data.push(row.maximumQty);
        fields?.showPreviousCountDate &&
            data.push(
                row.previousCountDate &&
                    getLocalizedDateTime({
                        dateTime: new Date(row.previousCountDate),
                        language,
                    }),
            );
        fields?.showPreviousCountQty && data.push(row.previousCountQty);
        fields?.showLastOrderLineId &&
            data.push(
                orderDetailsPageLink &&
                    orderNumber &&
                    `${authority}${orderDetailsPageLink.url}?orderNumber=${orderNumber}`,
            );

        return data;
    };

    if (Object.keys(props.parameter.ids).length) {
        const vmiBinsDataView = getVmiBinsDataView(state, state.pages.vmiReporting.getVmiBinsParameter);
        if (vmiBinsDataView.value) {
            for (const row of vmiBinsDataView.value) {
                if (props.parameter.ids[row.id]) {
                    data.push(prepareData(row));
                }
            }
        }
    } else {
        const result = await getVmiBins({
            ...state.pages.vmiReporting.getVmiBinsParameter,
            page: 1,
            pageSize: 9999,
            expand: ["product"],
        });
        if (result.vmiBins) {
            for (const row of result.vmiBins) {
                data.push(prepareData(row));
            }
        }
    }

    const documentData = {
        fields: [
            translate("Product Name"),
            translate("Part #"),
            fields?.showManufacturerItem && translate("Manufacture #"),
            fields?.showCustomerName && translate("My Part #"),
            fields?.showBinNumber && translate("Bin #"),
            translate("Min"),
            translate("Max"),
            fields?.showPreviousCountDate && translate("Previous Count Date"),
            fields?.showPreviousCountQty && translate("Previous Count Quantity"),
            fields?.showLastOrderLineId && translate("Previous Order"),
        ].filter(o => o),
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `products_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportVmiProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiReporting/CompleteExportVmiProducts",
    });
};

export const chain = [DispatchBeginExportVmiProducts, ExportData, DispatchCompleteExportVmiProducts];

const exportVmiProducts = createHandlerChainRunner(chain, "ExportVmiProducts");
export default exportVmiProducts;
