import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { css } from "styled-components";
import siteMessage from "@insite/client-framework/SiteMessage";
import { ShareEntityModel } from "@insite/client-framework/Types/ApiModels";
import shareEntity from "@insite/client-framework/Store/CommonHandlers/ShareEntity";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";

interface OwnProps {
    entityId: string;
    entityName: "Order" | "Invoice";
    extendedStyles?: ShareEntityButtonStyles;
    variant?: "button" | "clickable";
}

const mapDispatchToProps = {
    shareEntity,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface ShareEntityButtonStyles {
    clickable?: ClickablePresentationProps;
    button?: ButtonPresentationProps;
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    emailToGridItem?: GridItemProps;
    emailToTextField?: TextFieldProps;
    emailFromGridItem?: GridItemProps;
    emailFromTextField?: TextFieldProps;
    subjectGridItem?: GridItemProps;
    subjectTextField?: TextFieldProps;
    messageGridItem?: GridItemProps;
    messageTextArea?: TextAreaProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    sendButton?: ButtonPresentationProps;
}

export const shareEntityButtonStyles: ShareEntityButtonStyles = {
    button: {
        color: "secondary",
    },
    modal: {
        size: 600,
    },
    emailToGridItem: {
        width: 6,
    },
    emailFromGridItem: {
        width: 6,
    },
    subjectGridItem: {
        width: 12,
    },
    messageGridItem: {
        width: 12,
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    sendButton: {
        css: css` margin-left: 10px; `,
    },
};

const invoiceUrl = "/api/v1/invoices/shareinvoice";
const orderUrl = "/api/v1/orders/shareorder";
const ShareEntityButton: React.FC<Props> = ({
    entityId,
    entityName,
    extendedStyles,
    shareEntity,
    variant = "button",
}) => {
    if (!entityId) {
        return null;
    }

    let url = "";

    if (entityName === "Order") {
        url = orderUrl;
    } else if (entityName === "Invoice") {
        url = invoiceUrl;
    }

    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(shareEntityButtonStyles, extendedStyles));
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [emailTo, setEmailTo] = React.useState("");
    const [emailToError, setEmailToError] = React.useState("");
    const [emailFrom, setEmailFrom] = React.useState("");
    const [emailFromError, setEmailFromError] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [message, setMessage] = React.useState("");

    const requiredFieldMessage = translate("This is a required field");
    const emailFieldMessage = translate("Enter a valid email address");
    const checkForErrors = () => {
        // Regular expression to validate email address
        const regexp = new RegExp("\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        const localEmailToError = !emailTo ? requiredFieldMessage : (regexp.test(emailFrom) ? "" : emailFieldMessage);
        setEmailToError(localEmailToError);
        const localEmailFromError = !emailFrom ? requiredFieldMessage : (regexp.test(emailFrom) ? "" : emailFieldMessage);
        setEmailFromError(localEmailFromError);

        return !!(localEmailToError || localEmailFromError);
    };

    const resetFields = () => {
        setEmailTo("");
        setEmailToError("");
        setEmailFrom("");
        setEmailFromError("");
        setSubject(`${translate(`${entityName}`)} #${entityId}`);
        setMessage("");
    };

    const emailButtonClickHandler = () => {
        resetFields();
        setModalIsOpen(true);
    };

    const emailToChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailTo(event.target.value);
        setEmailToError(!event.target.value ? requiredFieldMessage : "");
    };

    const emailFromChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFrom(event.target.value);
        setEmailFromError(!event.target.value ? requiredFieldMessage : "");
    };

    const subjectChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(event.target.value);
    };

    const messageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const sendButtonClickHandler = () => {
        if (checkForErrors()) {
            return;
        }

        shareEntity({
            shareEntityModel: {
                entityId,
                entityName,
                emailTo,
                emailFrom,
                subject,
                message,
            } as ShareEntityModel,
            url,
            onSuccess: () => {
                setModalIsOpen(false);
                toasterContext.addToast({ body: siteMessage("Entity_Share_Success"), messageType: "success" });
            },
        });
    };

    return <>
        {variant === "clickable"
            && <Clickable {...styles.clickable} onClick={emailButtonClickHandler} data-test-selector="invoiceDetails_email">{translate("Email")}</Clickable>
        }
        {variant === "button"
            && <Button {...styles.button} onClick={emailButtonClickHandler} data-test-selector="invoiceDetails_email">{translate("Email")}</Button>
        }
        <Modal
            {...styles.modal}
            headline={`${translate(`Email ${entityName}`)} #${entityId}`}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}>
            <GridContainer {...styles.container} data-test-selector="shareEntity_modal">
                <GridItem {...styles.emailToGridItem}>
                    <TextField
                        label={`${translate("Email To")}*`}
                        value={emailTo}
                        error={emailToError}
                        onChange={emailToChangeHandler}
                        data-test-selector="shareEntity_emailTo"
                        {...styles.emailToTextField} />
                </GridItem>
                <GridItem {...styles.emailFromGridItem}>
                    <TextField
                        label={`${translate("Email From")}*`}
                        value={emailFrom}
                        error={emailFromError}
                        onChange={emailFromChangeHandler}
                        data-test-selector="shareEntity_emailFrom"
                        {...styles.emailFromTextField} />
                </GridItem>
                <GridItem {...styles.subjectGridItem}>
                    <TextField
                        label={translate("Subject")}
                        value={subject}
                        onChange={subjectChangeHandler}
                        data-test-selector="shareEntity_subject"
                        {...styles.subjectTextField} />
                </GridItem>
                <GridItem {...styles.messageGridItem}>
                    <TextArea
                        label={translate("Message")}
                        value={message}
                        onChange={messageChangeHandler}
                        data-test-selector="shareEntity_message"
                        {...styles.messageTextArea} />
                </GridItem>
            </GridContainer>
            <StyledWrapper {...styles.buttonsWrapper}>
                <Button {...styles.cancelButton} onClick={modalCloseHandler} data-test-selector="shareEntity_cancel">{translate("Cancel")}</Button>
                <Button {...styles.sendButton} onClick={sendButtonClickHandler} data-test-selector="shareEntity_submit">{translate("Send")}</Button>
            </StyledWrapper>
        </Modal>
    </>;
};

export default connect(null, mapDispatchToProps)(ShareEntityButton);