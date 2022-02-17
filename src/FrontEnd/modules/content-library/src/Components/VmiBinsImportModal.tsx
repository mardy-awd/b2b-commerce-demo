import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import getFileExtension from "@insite/client-framework/Common/Utilities/getFileExtension";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import batchLoadProducts, {
    UploadError,
} from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import cleanupUploadData from "@insite/client-framework/Store/Components/OrderUpload/Handlers/CleanupUploadData";
import processFile from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/ProcessFile";
import setIsBadFile from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/SetIsBadFile";
import setIsUploading from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/SetIsUploading";
import setUploadLimitExceeded from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/SetUploadLimitExceeded";
import setVmiBinsImportModalIsOpen from "@insite/client-framework/Store/Components/VmiBinsImportModal/Handlers/SetVmiBinsImportModalIsOpen";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import addVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/AddVmiBins";
import { VmiLocationStateContext } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import { VmiBinModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import FileUpload, { FileUploadPresentationProps } from "@insite/mobius/FileUpload";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationId?: string }>(location.search);
    return {
        parsedQuery,
        parsedItems: state.components.vmiBinsImportModal.parsedItems,
        isUploading: state.components.vmiBinsImportModal.isUploading,
        products: state.components.orderUpload.products,
        rowErrors: state.components.orderUpload.rowErrors,
        isBadFile: state.components.vmiBinsImportModal.isBadFile,
        productsProcessed: state.components.orderUpload.productsProcessed,
        uploadLimitExceeded: state.components.vmiBinsImportModal.uploadLimitExceeded,
        isOpen: state.components.vmiBinsImportModal.modalIsOpen,
    };
};

const mapDispatchToProps = {
    processFile,
    cleanupUploadData,
    batchLoadProducts,
    setUploadLimitExceeded,
    setIsBadFile,
    setIsUploading,
    setVmiBinsImportModalIsOpen,
    addVmiBins,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasToasterContext;

export interface VmiBinsImportModalStyles {
    modal?: ModalPresentationProps;
    container?: GridContainerProps;

    textGridItem?: GridItemProps;
    instructionText?: TypographyPresentationProps;
    templateLink?: LinkPresentationProps;
    controlsGridItem?: GridItemProps;
    fileUploader?: FileUploadPresentationProps;

    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    importButton?: ButtonPresentationProps;

    dataTable?: DataTableProps;
    tableHead?: DataTableHeadProps;
    itemNumHeader?: DataTableHeaderProps;
    itemNameHeader?: DataTableHeaderProps;
    itemReasonHeader?: DataTableHeaderProps;
    tableBody?: DataTableBodyProps;
    tableRow?: DataTableRowProps;
    itemNumCell?: DataTableCellBaseProps;
    itemNameCell?: DataTableCellBaseProps;
    itemReasonCell?: DataTableCellBaseProps;

    errorLineHeader?: DataTableHeaderProps;
    errorLineCell?: DataTableCellBaseProps;

    tableWrapper?: InjectableCss;
}

export const vmiBinsImportModalStyles: VmiBinsImportModalStyles = {
    modal: {
        cssOverrides: {
            modalBody: css`
                overflow: visible;
            `,
        },
    },
    container: { gap: 15 },
    controlsGridItem: {
        width: 12,
        css: css`
            display: block;
            max-width: 450px;
            padding-bottom: 40px;
        `,
    },
    textGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    instructionText: {
        css: css`
            margin-bottom: 12px;
        `,
    },
    fileUploader: {
        buttonProps: {
            variant: "tertiary",
        },
    },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: 12,
    },
    cancelButton: { variant: "tertiary" },
    importButton: {
        css: css`
            margin-left: 1rem;
        `,
    },
    tableRow: {
        css: css`
            td {
                white-space: normal;
            }
        `,
    },
    tableWrapper: {
        css: css`
            max-height: 400px;
            overflow-y: auto;
            width: 100%;
        `,
    },
};

const styles = vmiBinsImportModalStyles;

const VmiBinsImportModal = ({
    isOpen,
    toaster,
    parsedQuery,
    parsedItems,
    isUploading,
    products,
    rowErrors,
    isBadFile,
    productsProcessed,
    uploadLimitExceeded,
    processFile,
    cleanupUploadData,
    batchLoadProducts,
    setUploadLimitExceeded,
    setIsBadFile,
    setIsUploading,
    setVmiBinsImportModalIsOpen,
    addVmiBins,
}: Props) => {
    const fileUploadRef = useRef({ value: "" } as HTMLInputElement);

    const [file, setFile] = useState<any>(null);
    const [incorrectFileExtension, setIncorrectFileExtension] = React.useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const { value: vmiLocation } = useContext(VmiLocationStateContext);
    const vmiLocationId = vmiLocation?.id || parsedQuery?.locationId;
    if (!vmiLocationId) {
        return null;
    }

    useEffect(() => batchGetProducts(), [parsedItems]);

    useEffect(() => processImport(), [productsProcessed]);

    useEffect(() => {
        if (!isOpen) {
            resetState();
            cleanupUploadData();
        }
    }, [isOpen]);

    const resetState = () => {
        setFile(null);
        setIncorrectFileExtension(false);
        setErrorMessages([]);
        setUploadLimitExceeded({ uploadLimitExceeded: false });
        setIsBadFile({ isBadFile: false });
    };

    const closeModalHandler = (isCancel = false) => {
        setIsUploading({ isUploading: false });

        if (isCancel) {
            if (rowErrors && rowErrors.length > 0) {
                cleanupUploadData();
                return;
            }

            if (errorMessages.length > 0) {
                setErrorMessages([]);
                return;
            }
        }

        setVmiBinsImportModalIsOpen({ modalIsOpen: false });
    };

    const batchGetProducts = () => {
        cleanupUploadData();
        if (!file) {
            return;
        }

        if (parsedItems.length === 0) {
            setIsBadFile({ isBadFile: true });
            return;
        }

        const extendedNames = parsedItems.map(item => item.name);
        batchLoadProducts({ extendedNames, firstRowHeading: false, checkInventory: false });
    };

    const fileChangeHandler = (event: React.ChangeEvent<any>) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const fileExtension = getFileExtension(uploadedFile.name);
            const incorrectFileExtension = ["csv"].indexOf(fileExtension) === -1;
            setIncorrectFileExtension(incorrectFileExtension);
            setIsBadFile({ isBadFile: incorrectFileExtension });
            setUploadLimitExceeded({ uploadLimitExceeded: false });
        }
    };

    const onImportClick = () => {
        const reader = new FileReader();
        reader.onload = onReaderLoad(getFileExtension(file.name));
        reader.readAsArrayBuffer(file);
    };

    const onReaderLoad = (fileExtension: string) => {
        return (e: Event) => {
            const data = (e.target as any).result;
            processFile({ data, fileExtension });
        };
    };

    const processImport = React.useCallback(() => {
        if (!productsProcessed) {
            return;
        }

        if (parsedItems.length === products.length && rowErrors.length === 0) {
            importProducts();
        } else {
            setIsUploading({ isUploading: false });
        }
    }, [productsProcessed, parsedItems, products, rowErrors]);

    const importProducts = () => {
        const erpNumberToIdMap: SafeDictionary<string> = {};
        for (const product of products) {
            erpNumberToIdMap[product.erpNumber.toLowerCase()] = product.id;
        }
        addVmiBins({
            vmiLocationId,
            vmiBins: parsedItems.map(o => {
                return {
                    productId: erpNumberToIdMap[o.name.toLowerCase()],
                    binNumber: o.binNumber,
                    minimumQty: (o.minQty && +o.minQty) || 0,
                    maximumQty: (o.maxQty && +o.maxQty) || 0,
                } as VmiBinModel;
            }),
            onComplete: result => {
                setIsUploading({ isUploading: false });
                if (result.apiResult?.successful) {
                    setVmiBinsImportModalIsOpen({ modalIsOpen: false });
                    toaster.addToast({
                        body: translate("Product(s) successfully imported"),
                        messageType: "success",
                    });
                } else if (result.apiResult?.errorMessage) {
                    setErrorMessages(result.apiResult?.errorMessage.split("\r\n"));
                }
            },
        });
    };

    return (
        <Modal
            {...styles.modal}
            handleClose={() => closeModalHandler()}
            headline={translate("Import CSV")}
            isOpen={isOpen}
            size={600}
        >
            <GridContainer {...styles.container}>
                {(!rowErrors || rowErrors.length === 0) && errorMessages.length === 0 && (
                    <>
                        <GridItem {...styles.textGridItem}>
                            <Typography as="p" {...styles.instructionText}>
                                {siteMessage("Vmi_BinsImportInstructions_Line1")}
                            </Typography>
                            <Typography as="p" {...styles.instructionText}>
                                {siteMessage("Vmi_BinsImportInstructions_Line2")}
                            </Typography>
                            <Typography as="p" {...styles.instructionText}>
                                <Link href="/Excel/VMIImport_products.csv" target="_blank" {...styles.templateLink}>
                                    {translate("Download CSV File")}
                                </Link>
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.controlsGridItem}>
                            <FileUpload
                                {...styles.fileUploader}
                                inputRef={fileUploadRef}
                                fileName={file?.name || ""}
                                accept=".csv"
                                label={translate("Choose File")}
                                labelPosition="top"
                                error={
                                    incorrectFileExtension
                                        ? translate("only .csv is supported")
                                        : uploadLimitExceeded
                                        ? siteMessage("Vmi_BinsImportRowsLimitExceeded")
                                        : isBadFile
                                        ? siteMessage("Vmi_BinsImportUploadError")
                                        : undefined
                                }
                                onFileChange={fileChangeHandler}
                                uid="vmiBinUploadFileUpload"
                            />
                        </GridItem>
                    </>
                )}
                {rowErrors && rowErrors.length > 0 && errorMessages.length === 0 && (
                    <StyledWrapper {...styles.tableWrapper}>
                        <DataTable {...styles.dataTable}>
                            <DataTableHead {...styles.tableHead}>
                                <DataTableHeader {...styles.itemNumHeader}>{translate("Row")}</DataTableHeader>
                                <DataTableHeader {...styles.itemNameHeader}>{translate("Item #")}</DataTableHeader>
                                <DataTableHeader {...styles.itemReasonHeader}>{translate("Reason")}</DataTableHeader>
                            </DataTableHead>
                            <DataTableBody {...styles.tableBody}>
                                {rowErrors.map(({ index, name, error }) => (
                                    <DataTableRow key={index} {...styles.tableRow}>
                                        <DataTableCell {...styles.itemNumCell}>{index}</DataTableCell>
                                        <DataTableCell {...styles.itemNameCell}>{name}</DataTableCell>
                                        <DataTableCell {...styles.itemReasonCell}>
                                            {error === UploadError.NotEnough &&
                                                siteMessage("QuickOrder_NotEnoughQuantity")}
                                            {error === UploadError.ConfigurableProduct &&
                                                siteMessage("QuickOrder_CannotOrderConfigurable")}
                                            {error === UploadError.StyledProduct &&
                                                siteMessage("QuickOrder_CannotOrderStyled")}
                                            {error === UploadError.Unavailable &&
                                                siteMessage("QuickOrder_ProductIsUnavailable")}
                                            {error === UploadError.InvalidUnit && translate("Invalid U/M")}
                                            {error === UploadError.NotFound && siteMessage("Product_NotFound")}
                                            {error === UploadError.OutOfStock && translate("Out of stock")}
                                        </DataTableCell>
                                    </DataTableRow>
                                ))}
                            </DataTableBody>
                        </DataTable>
                    </StyledWrapper>
                )}
                {errorMessages.length > 0 && (
                    <StyledWrapper {...styles.tableWrapper}>
                        <DataTable {...styles.dataTable}>
                            <DataTableHead {...styles.tableHead}>
                                <DataTableHeader {...styles.errorLineHeader}>{translate("Error")}</DataTableHeader>
                            </DataTableHead>
                            <DataTableBody {...styles.tableBody}>
                                {errorMessages.map(message => (
                                    <DataTableRow key={message} {...styles.tableRow}>
                                        <DataTableCell {...styles.errorLineCell}>{message}</DataTableCell>
                                    </DataTableRow>
                                ))}
                            </DataTableBody>
                        </DataTable>
                    </StyledWrapper>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} type="button" onClick={() => closeModalHandler(true)}>
                        {translate("Cancel")}
                    </Button>
                    {(!rowErrors || rowErrors.length === 0) && errorMessages.length === 0 && (
                        <Button
                            {...styles.importButton}
                            type="button"
                            disabled={!file || isBadFile || isUploading}
                            onClick={onImportClick}
                        >
                            {translate("Import")}
                        </Button>
                    )}
                </GridItem>
            </GridContainer>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(VmiBinsImportModal));
