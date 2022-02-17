import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import { ParsedItem } from "@insite/client-framework/Store/Components/VmiBinsImportModal/VmiBinsImportModalState";

export interface ProcessFileParameter {
    data: ArrayBuffer;
    fileExtension: string;
}

export interface ProcessFileResult {
    parsedItems: ParsedItem[];
    uploadLimitExceeded: boolean;
    isBadFile: boolean;
    isUploading: boolean;
}

type HandlerType = HandlerWithResult<ProcessFileParameter, ProcessFileResult>;

export const DispatchBeginProcessFile: HandlerType = props => {
    props.dispatch({
        type: "Components/VmiBinsImportModal/BeginProcessFile",
    });
};

export const CreateDefaultResult: HandlerType = props => {
    props.result = {
        parsedItems: [],
        uploadLimitExceeded: false,
        isBadFile: false,
        isUploading: false,
    };
};

export const ProcessUploadedFile: HandlerType = async props => {
    const data = fixData(props.parameter.data);
    try {
        if (props.parameter.fileExtension === "csv") {
            await processCsv(data, props.result);
        } else {
            props.result.isBadFile = true;
        }
    } catch (error) {
        logger.error(error);
        props.result.isBadFile = true;
    }

    if (!props.result.isBadFile && !props.result.uploadLimitExceeded) {
        props.result.isUploading = true;
    }
};

const fixData = (data: ArrayBuffer) => {
    let o = "";
    let l = 0;
    const w = 10240;
    for (; l < data.byteLength / w; ++l) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)) as any);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)) as any);

    return o;
};

const processCsv = async (data: string, result: ProcessFileResult) => {
    const { parse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");
    result.parsedItems = [];
    const newLineIndex = data.lastIndexOf("\r\n");
    if (newLineIndex + 2 === data.length) {
        data = data.substr(0, newLineIndex);
    }

    const results = parse(data);
    if (results.errors.length > 0) {
        result.isBadFile = true;
        return;
    }

    const rows = results.data;
    const firstRow = rows[0];
    const skipFirstRow =
        firstRow &&
        firstRow.length === 4 &&
        firstRow.every((o: any) => o) &&
        // eslint-disable-next-line no-restricted-globals
        isNaN(parseFloat(firstRow[2])) &&
        // eslint-disable-next-line no-restricted-globals
        isNaN(parseFloat(firstRow[3]));

    if (limitExceeded(rows.length, skipFirstRow, result)) {
        return;
    }

    rows.forEach((s: (string | null)[], index: number) => {
        if ((index === 0 && skipFirstRow) || s[0] == null || s[0].length === 0) {
            return;
        }

        const objectToAdd: ParsedItem = {
            name: s[0],
            binNumber: s[1],
            minQty: s[2],
            maxQty: s[3],
        };

        result.parsedItems.push(objectToAdd);
    });
};

const limitExceeded = (rowsCount: number, skipFirstRow: boolean, result: ProcessFileResult) => {
    const maximumAllowedRowsCount = 500 + (skipFirstRow ? 1 : 0);
    result.uploadLimitExceeded = rowsCount > maximumAllowedRowsCount;
    return result.uploadLimitExceeded;
};

export const DispatchCompleteProcessFile: HandlerType = props => {
    props.dispatch({
        type: "Components/VmiBinsImportModal/CompleteProcessFile",
        result: props.result,
    });
};

export const chain = [DispatchBeginProcessFile, CreateDefaultResult, ProcessUploadedFile, DispatchCompleteProcessFile];

const processFile = createHandlerChainRunner(chain, "ProcessFile");
export default processFile;
