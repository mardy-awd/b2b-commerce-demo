import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import subscribe from "@insite/client-framework/Store/CommonHandlers/Subscribe";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as cssLinter from "css";
import parse from "html-react-parser";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    label = "label",
    title = "title",
    description = "description",
    placeholder = "placeholder",
    disclaimer = "disclaimer",
    alignment = "alignment",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.label]: string;
        [fields.description]: string;
        [fields.placeholder]: string;
        [fields.disclaimer]: string;
        [fields.alignment]: string;
        [fields.customCSS]: string;
    };
}

const mapDispatchToProps = {
    subscribe,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SubscribeStyles {
    mainGridContainer: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleLabel?: TypographyPresentationProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyPresentationProps;
    emailGridItem?: GridItemProps;
    emailTextField?: TextFieldPresentationProps;
    emailButton?: ButtonPresentationProps;
    disclaimerGridItem?: GridItemProps;
    disclaimerText?: TypographyPresentationProps;
}

export const subscribeStyles: SubscribeStyles = {
    mainGridContainer: {
        gap: 10,
        css: css`
            width: 100%;
            display: flex;
        `,
    },
    titleGridItem: {
        width: 12,
    },
    titleLabel: {
        variant: "h4",
        css: css`
            margin-bottom: -5px;
        `,
    },
    descriptionGridItem: {
        width: 12,
    },
    descriptionText: {
        css: css`
            margin-bottom: -1rem;
        `,
    },
    emailGridItem: {
        width: 12,
    },
    emailTextField: {
        cssOverrides: {
            formField: css`
                max-width: 300px;
                margin-right: 10px;
            `,
        },
    },
    emailButton: {
        css: css`
            width: 200px;
        `,
    },
    disclaimerGridItem: {
        width: 12,
    },
    disclaimerText: {
        css: css`
            font-size: 12px;
        `,
    },
};

const defaultCustomCss = `.main-grid-container{
}

.title-grid-item{
}

.title{
}

.description-grid-item{
}

.description-text{
}

.email-grid-item{
}

.email-text-field{
}

.email-button{
}

.disclaimer-grid-item{
}

.disclaimer-text{
}`;

const emailRegexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

export const CmsSubscribe = ({ fields, subscribe, id }: Props) => {
    const emailRequiredFieldMessage = siteMessage("EmailSubscription_EmailIsRequiredErrorMessage");
    const emailFieldMessage = siteMessage("EmailSubscription_EmailIsInvalidErrorMessage");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(emailRequiredFieldMessage);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const toasterContext = useContext(ToasterContext);

    const styles = useMergeStyles("subscribe", subscribeStyles);

    const onSubscribeClick = () => {
        setIsSubmitted(true);
        if (!validateEmail(email)) {
            return;
        }

        subscribe({
            email,
            onSuccess: () => {
                toasterContext.addToast({ body: siteMessage("Email_Subscribe_Success"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const emailChangeHandler = (email: string) => {
        validateEmail(email);
        setEmail(email);
    };

    const validateEmail = (email: string) => {
        const errorMessage = !email ? emailRequiredFieldMessage : emailRegexp.test(email) ? "" : emailFieldMessage;
        setEmailError(errorMessage);
        return !errorMessage;
    };

    const gridItemCss = (gridItemProps?: GridItemProps) => {
        return css`
            justify-content: ${fields.alignment ? fields.alignment : "center"};
            ${gridItemProps?.css}
        `;
    };

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <GridContainer className="main-grid-container" {...styles.mainGridContainer}>
                <GridItem className="title-grid-item" {...styles.titleGridItem} css={gridItemCss(styles.titleGridItem)}>
                    <Typography className="title" {...styles.titleLabel}>
                        {fields.title}
                    </Typography>
                </GridItem>
                <GridItem
                    className="description-grid-item"
                    {...styles.descriptionGridItem}
                    css={gridItemCss(styles.descriptionGridItem)}
                >
                    <Typography className="description-text" {...styles.descriptionText}>
                        {parse(fields.description, parserOptions)}
                    </Typography>
                </GridItem>
                <GridItem className="email-grid-item" {...styles.emailGridItem} css={gridItemCss(styles.emailGridItem)}>
                    <TextField
                        className="email-text-field"
                        {...styles.emailTextField}
                        id={id}
                        placeholder={fields.placeholder}
                        value={email}
                        onChange={e => emailChangeHandler(e.currentTarget.value)}
                        error={isSubmitted && emailError}
                    />
                    <Button
                        className="email-button"
                        {...styles.emailButton}
                        onClick={onSubscribeClick}
                        disabled={isSubmitted && !!emailError}
                    >
                        {fields.label}
                    </Button>
                </GridItem>
                <GridItem
                    className="disclaimer-grid-item"
                    {...styles.disclaimerGridItem}
                    css={gridItemCss(styles.disclaimerGridItem)}
                >
                    <Typography className="disclaimer-text" {...styles.disclaimerText}>
                        {parse(fields.disclaimer, parserOptions)}
                    </Typography>
                </GridItem>
            </GridContainer>
        </StyledWrapper>
    );
};

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(CmsSubscribe),
    definition: {
        group: "Basic",
        icon: "bell",
        fieldDefinitions: [
            {
                name: fields.alignment,
                displayName: "Layout",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Left", value: "flex-start" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "flex-end" },
                ],
                defaultValue: "center",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "Subscribe",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.description,
                displayName: "Description",
                editorTemplate: "RichTextField",
                defaultValue: "<p>Keep up-to-date on product news and the latest offers.</p>",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.placeholder,
                displayName: "Placeholder Text",
                editorTemplate: "TextField",
                defaultValue: "Enter email address",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.disclaimer,
                displayName: "Disclaimer",
                editorTemplate: "RichTextField",
                defaultValue: "",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.label,
                displayName: "Button Label",
                editorTemplate: "TextField",
                defaultValue: "Subscribe",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
                tab: advancedTab,
                defaultValue: defaultCustomCss,
                isVisible: (item, shouldDisplayAdvancedFeatures) => !!shouldDisplayAdvancedFeatures,
                validate: value => {
                    if (value === undefined || value === null) {
                        return "";
                    }

                    const result = cssLinter.parse(value, { silent: true });
                    if (result?.stylesheet?.parsingErrors) {
                        // the error output at this time only has room for one line so we just show the first error
                        return result.stylesheet.parsingErrors.length <= 0
                            ? ""
                            : result.stylesheet.parsingErrors.map(error => `${error.reason} on line ${error.line}`)[0];
                    }

                    return "Unable to parse Css";
                },
                options: {
                    mode: "css",
                    lint: true,
                    autoRefresh: true,
                },
            },
        ],
    },
};

export default widgetModule;
