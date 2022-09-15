import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateTemporarySearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateTemporarySearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import Select, { SelectProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.incompleteGetOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateTemporarySearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchFieldOrderTotalOpertatorStyles {
    select?: SelectProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const orderTotalOperatorStyles: OrderHistorySearchFieldOrderTotalOpertatorStyles = {};
const styles = orderTotalOperatorStyles;

class OrderHistorySearchFieldOrderTotalOperator extends React.Component<Props> {
    orderTotalOperators = ["Greater Than", "Less Than", "Equal To"];

    handleChange = (event: React.FormEvent<HTMLSelectElement>): void => {
        this.props.updateTemporarySearchFields({ orderTotalOperator: event.currentTarget.value });
    };

    render() {
        const value = this.props.parameter?.orderTotalOperator || "";

        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Select
                    data-test-selector="orderHistory_filterOrderTotalOperator"
                    label={translate("Order Total")}
                    {...styles.select}
                    value={value}
                    onChange={this.handleChange}
                >
                    <option value="">{translate("Select")}</option>
                    {this.orderTotalOperators.map(operator => (
                        <option key={operator} value={operator}>
                            {/* this is valid, our rule isn't smart enough to handle this case */}
                            {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                            {translate(operator)}
                        </option>
                    ))}
                </Select>
            </SearchFieldWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldOrderTotalOperator),
    definition: {
        group: "Order History",
        displayName: "Order Total Operator",
        allowedContexts: ["OrderHistoryPage", "VmiOrderHistoryPage"],
    },
};

export default widgetModule;
