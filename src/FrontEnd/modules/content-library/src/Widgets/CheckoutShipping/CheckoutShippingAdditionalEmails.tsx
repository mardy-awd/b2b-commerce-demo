import validateEmail from "@insite/client-framework/Common/Utilities/validateEmail";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import setAdditionalEmails from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetAdditionalEmails";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutShippingFormContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import TagsField, { TagsFieldPresentationProps } from "@insite/mobius/TagsField";
import Tooltip from "@insite/mobius/Tooltip";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutShipping;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    return {
        additionalEmails: cart?.additionalEmails || "",
    };
};

const mapDispatchToProps = {
    setAdditionalEmails,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutShippingAdditionalEmailsStyles {
    tagsField?: TagsFieldPresentationProps;
}

export const checkoutShippingAdditionalEmailsStyles: CheckoutShippingAdditionalEmailsStyles = {};

const styles = checkoutShippingAdditionalEmailsStyles;

interface State {
    additionalEmails: string[];
    error?: string;
}

class CheckoutShippingAdditionalEmails extends React.Component<Props, State> {
    static contextType = CheckoutShippingFormContext;
    context!: React.ContextType<typeof CheckoutShippingFormContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            additionalEmails: this.props.additionalEmails ? this.props.additionalEmails.split(",") : [],
        };
    }

    componentDidMount() {
        this.context.validators.additionalEmails = () => {
            const isValid = this.state.additionalEmails.every(o => validateEmail(o));
            this.setState({ error: isValid ? "" : translate("Please enter a valid email addresses") });
            return Promise.resolve(isValid);
        };
    }

    additionalEmailsChangeHandler = (value: string[]) => {
        this.setState({
            additionalEmails: value,
        });
        this.props.setAdditionalEmails({
            additionalEmails: value.join(","),
        });
    };

    static getDerivedStateFromProps(props: Props, state: State) {
        if (typeof state.additionalEmails === "undefined" && typeof props.additionalEmails !== "undefined") {
            return {
                additionalEmails: props.additionalEmails ? props.additionalEmails.split(",") : [],
            };
        }
        return state;
    }

    render() {
        return (
            <TagsField
                {...styles.tagsField}
                label={
                    <>
                        {translate("Additional Emails")}
                        <Tooltip text={siteMessage("Checkout_AdditionalEmailsTooltip") as string} />
                    </>
                }
                placeholder={translate("Type and hit 'Enter' to add email address")}
                value={this.state.additionalEmails}
                error={this.state.error}
                validate={validateEmail}
                validationFailedError={translate("Please enter a valid email address")}
                onChange={this.additionalEmailsChangeHandler}
            />
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingAdditionalEmails),
    definition: {
        group: "Checkout - Shipping",
        displayName: "Additional Emails",
        allowedContexts: ["CheckoutShippingPage"],
    },
};

export default widgetModule;
