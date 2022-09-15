import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import { OrderStatusMappingModel } from "@insite/client-framework/Types/ApiModels";
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
        orderStatusMappings: getOrderStatusMappingDataView(state).value,
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchFieldStatusStyles {
    select?: SelectProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const statusStyles: OrderHistorySearchFieldStatusStyles = {};
const styles = statusStyles;

class OrderHistorySearchFieldStatus extends React.Component<Props> {
    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value) {
            this.props.updateSearchFields({
                status: event.currentTarget.value.split(","),
                displayName: findDisplayName(event.currentTarget.value, this.props.orderStatusMappings),
            });
        } else {
            this.props.updateSearchFields({ status: undefined });
        }
    };

    render() {
        const options = this.props.orderStatusMappings || [];
        const uniqueOptions = new Map<string, string[]>();
        for (const option of options) {
            const erpOrderStatuses = uniqueOptions.get(option.displayName) || [];
            erpOrderStatuses.push(option.erpOrderStatus);
            uniqueOptions.set(option.displayName, erpOrderStatuses);
        }

        const value =
            this.props.parameter.status && this.props.parameter.status.length > 0
                ? this.props.parameter.status.join(",")
                : "";

        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Select
                    label={translate("Status")}
                    {...styles.select}
                    value={value}
                    onChange={this.handleChange}
                    data-test-selector="orderHistory_filterStatus"
                >
                    <option value="">{translate("Select")}</option>
                    {Array.from(uniqueOptions, ([name, values]) => ({ name, values })).map(option => (
                        <option key={option.values.join(",")} value={option.values.join(",")}>
                            {option.name}
                        </option>
                    ))}
                </Select>
            </SearchFieldWrapper>
        );
    }
}

function findDisplayName(erpOrderStatus: string, orderStatusMappings: OrderStatusMappingModel[] = []) {
    const arrOfStatus = erpOrderStatus.split(",");

    let returnVal;
    for (let i = 0; i < orderStatusMappings.length; i++) {
        const option = orderStatusMappings[i];
        if (arrOfStatus.includes(option.erpOrderStatus)) {
            returnVal = option.displayName;
            break;
        }
    }
    return returnVal;
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldStatus),
    definition: {
        group: "Order History",
        displayName: "Status",
        allowedContexts: ["OrderHistoryPage", "VmiOrderHistoryPage"],
    },
};

export default widgetModule;
