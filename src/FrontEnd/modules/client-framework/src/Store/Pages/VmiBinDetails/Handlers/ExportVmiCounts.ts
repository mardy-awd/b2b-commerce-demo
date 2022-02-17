import { SafeDictionary } from "@insite/client-framework/Common/Types";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getVmiCounts } from "@insite/client-framework/Services/VmiCountsService";
import { getVmiCountsDataView } from "@insite/client-framework/Store/Data/VmiCounts/VmiCountsSelectors";
import translate from "@insite/client-framework/Translate";
import { VmiCountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    ids: SafeDictionary<boolean>;
}>;

export const DispatchBeginExportVmiCounts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/BeginExportVmiCounts",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data = [];
    const state = props.getState();
    const language = state.context.session.language;

    const prepareData = (row: VmiCountModel) => {
        const data: (string | number)[] = [
            row.count,
            row.createdOn &&
                getLocalizedDateTime({
                    dateTime: new Date(row.createdOn),
                    language,
                }),
            row.createdBy,
        ];

        return data;
    };

    if (Object.keys(props.parameter.ids).length) {
        const vmiCountsDataView = getVmiCountsDataView(state, state.pages.vmiBinDetails.getVmiCountsParameter);
        if (vmiCountsDataView.value) {
            for (const row of vmiCountsDataView.value) {
                if (props.parameter.ids[row.id]) {
                    data.push(prepareData(row));
                }
            }
        }
    } else {
        const result = await getVmiCounts({
            ...state.pages.vmiBinDetails.getVmiCountsParameter,
            page: 1,
            pageSize: 9999,
        });
        if (result.binCounts) {
            for (const row of result.binCounts) {
                data.push(prepareData(row));
            }
        }
    }

    const documentData = {
        fields: [translate("Count"), translate("Last Count Date"), translate("User")],
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `counts_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportVmiCounts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiBinDetails/CompleteExportVmiCounts",
    });
};

export const chain = [DispatchBeginExportVmiCounts, ExportData, DispatchCompleteExportVmiCounts];

const exportVmiCounts = createHandlerChainRunner(chain, "ExportVmiCounts");
export default exportVmiCounts;
