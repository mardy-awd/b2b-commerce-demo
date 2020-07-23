import { QuoteType } from "@insite/client-framework/Services/QuoteService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import createOrRequestQuote from "@insite/client-framework/Store/Pages/RfqRequestQuote/Handlers/CreateOrRequestQuote";
import updateQuoteParameter from "@insite/client-framework/Store/Pages/RfqRequestQuote/Handlers/UpdateQuoteParameter";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqRequestQuotePageContext } from "@insite/content-library/Pages/RfqRequestQuotePage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup/RadioGroup";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea/TextArea";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import FieldSetPresentationProps from "@insite/mobius/utilities/fieldSetProps";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { ChangeEvent, FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state).value,
    accounts: state.pages.rfqRequestQuote.accounts,
    rfqQuoteDetailsPageUrl: getPageLinkByPageType(state, "RfqQuoteDetailsPage")?.url,
    rfqQuoteConfirmationPageUrl: getPageLinkByPageType(state, "RfqConfirmationPage")?.url,
});

const mapDispatchToProps = {
    updateQuoteParameter,
    createOrRequestQuote,
};

type Props = ReturnType<typeof mapStateToProps> & HasHistory & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface RfqRequestQuoteSpecificationsStyles {
    quoteTypeRadioGroup?: RadioGroupProps;
    quoteTypeRadioButton?: FieldSetPresentationProps<RadioComponentProps>;
    jobNameTextField?: TextFieldPresentationProps;
    assignUserSelect?: SelectPresentationProps;
    notesTextArea?: TextAreaProps;
    submitButton?: ButtonPresentationProps;
}

const styles: RfqRequestQuoteSpecificationsStyles = {
    quoteTypeRadioGroup: {
        // TODO ISC-12425 set these radio buttons to horizontal and remove the  "& > div" selector
        css: css`
                display: inline-block;
                padding-bottom: 20px;
                width: 100%;
                flex-direction: row;
                & > div {
                    margin-right: 20px;
                    display: inline-flex;
                }
            `,
    },
    jobNameTextField: {
        cssOverrides: {
            formField: css` padding-bottom: 20px; `,
        },
    },
    assignUserSelect: {
        cssOverrides: {
            formField: css` padding-bottom: 20px; `,
        },
    },
    notesTextArea: {
        cssOverrides: {
            formField: css` margin-bottom: 20px; `,
        },
    },
};

export const rfqRequestQuoteSpecificationsStyles = styles;

const RfqRequestQuoteSpecifications: FC<Props> = ({
    cart,
    accounts,
    updateQuoteParameter,
    createOrRequestQuote,
    history,
    rfqQuoteDetailsPageUrl,
    rfqQuoteConfirmationPageUrl,
}) => {

    const [notes, setNotes] = React.useState(cart?.notes);
    const [jobName, setJobName] = React.useState("");
    const [jobNameError, setJobNameError] = React.useState<React.ReactNode>("");
    const [quoteType, setQuoteType] = React.useState<QuoteType>("sales");
    const [accountId, setAccountId] = React.useState<string|undefined>(undefined);
    const [accountIdError, setAccountIdError] = React.useState<React.ReactNode>("");

    const saveParameter = () => {
        updateQuoteParameter({
            quoteId: cart?.id || "",
            quoteType,
            accountId,
            jobName,
            note: notes || "",
        });
    };
    useEffect(saveParameter, [notes, jobName, quoteType, accountId, cart?.id]);

    if (!cart) {
        return null;
    }

    const isCreatingQuote = cart.isSalesperson;

    const notesChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.currentTarget.value);
    };

    const quoteTypeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setQuoteType(event.currentTarget.value as QuoteType);
    };

    const userChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const id = event.currentTarget.value;
        setAccountId(id);
        validateUser(id);
    };

    const validateUser = (userId: string) => {
        const valid = !isCreatingQuote || userId.trim();
        setAccountIdError(valid ? "" : siteMessage("Rfq_UserIsRequired"));
        return valid;
    };

    const jobNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.currentTarget.value;
        setJobName(name);
        validateJobName(name);
    };

    const validateJobName = (jobName: string) => {
        const valid = quoteType !== "job" || jobName.trim();
        setJobNameError(valid ? "" : siteMessage("Rfq_Job_Name_required"));
        return valid;
    };

    const canSubmit = cart.cartLines && cart.cartLines.length > 0;

    const submitHandler = () => {
        if (!canSubmit || !validateJobName(jobName) || !validateUser(accountId || "")) {
            return;
        }

        createOrRequestQuote({ onSuccess: (result) => {
            if (isCreatingQuote && rfqQuoteDetailsPageUrl) {
                history.push(`${rfqQuoteDetailsPageUrl}?quoteId=${result.id}`);
            } else if (!isCreatingQuote && rfqQuoteConfirmationPageUrl) {
                history.push(`${rfqQuoteConfirmationPageUrl}?quoteId=${result.id}`);
            }
        } });
    };

    const submitButtonClickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        submitHandler();
    };

    return (
        <form onSubmit={submitHandler}>
            <RadioGroup
                {...styles.quoteTypeRadioGroup}
                label={translate("Quote Type")}
                value={quoteType}
                onChangeHandler={quoteTypeChangeHandler}
                data-test-selector="requestQuoteTypeRadio"
            >
                <Radio {...styles.quoteTypeRadioButton} value="sales">{translate("Sales Quote")}</Radio>
                <Radio {...styles.quoteTypeRadioButton} value="job">{translate("Job Quote")}</Radio>
            </RadioGroup>
            {quoteType === "job" && <TextField
                {...styles.jobNameTextField}
                label={translate("Job Name")}
                required={true}
                error={jobNameError}
                placeholder={translate("Job Name Goes Here")}
                onChange={jobNameChangeHandler}
                data-test-selector="requestQuoteJobName"
            />}
            {isCreatingQuote && <Select
                label={translate("Assign User")}
                required={true}
                {...styles.assignUserSelect}
                value={accountId}
                error={accountIdError}
                onChange={userChangeHandler}
                data-test-selector="requestQuoteAssignUserSelect"
            >
                <option key="" value="">{translate("Select a User")}</option>
                {accounts.map(o => {
                    return (
                        <option key={o.id} value={o.id}>{(o.firstName && o.lastName) ? `${o.firstName} ${o.lastName}` : o.userName}</option>
                    );
                })}
            </Select>}
            <TextArea
                {...styles.notesTextArea}
                label={translate("Order Notes")}
                placeholder={translate("You can start typing notes here")}
                value={notes}
                onChange={notesChangeHandler} />
            {canSubmit && <Button
                    {...styles.submitButton}
                    onClick={submitButtonClickHandler}
                    data-test-selector="requestQuoteSubmitButton"
                >
                    {translate(isCreatingQuote ? "Create Quote" : "Submit Quote")}
                </Button>
            }
        </form>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(RfqRequestQuoteSpecifications)),
    definition: {
        group: "RFQ Request Quote",
        displayName: "Specifications",
        allowedContexts: [RfqRequestQuotePageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
