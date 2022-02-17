export interface ParsedItem {
    name: string;
    binNumber: string | null;
    minQty: string | null;
    maxQty: string | null;
    qtyOrdered?: number;
    unitOfMeasure?: string;
}
export default interface VmiBinsImportModalState {
    parsedItems: ParsedItem[];
    isBadFile: boolean;
    isUploading: boolean;
    uploadLimitExceeded: boolean;
    modalIsOpen: boolean;
}
