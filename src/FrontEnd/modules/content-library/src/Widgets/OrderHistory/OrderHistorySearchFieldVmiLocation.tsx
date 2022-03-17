import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocations";
import { getVmiLocationsDataView } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
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
        vmiLocationsDataView: getVmiLocationsDataView(state, state.pages.orderHistory.getVmiLocationsParameter),
        getOrdersParameter: state.pages.orderHistory.getOrdersParameter,
        getVmiLocationsParameter: state.pages.orderHistory.getVmiLocationsParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    loadVmiLocations,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchFieldVmiLocationStyles {
    select?: SelectProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const vmiLocationStyles: OrderHistorySearchFieldVmiLocationStyles = {};
const styles = vmiLocationStyles;

class OrderHistorySearchFieldVmiLocation extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.vmiLocationsDataView.value && !this.props.vmiLocationsDataView.isLoading) {
            this.props.loadVmiLocations(this.props.getVmiLocationsParameter);
        }
    }

    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateSearchFields({ vmiLocationId: event.currentTarget.value });
    };

    render() {
        const vmiLocations = this.props.vmiLocationsDataView.value || [];

        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Select
                    label={translate("VMI Location")}
                    {...styles.select}
                    value={this.props.getOrdersParameter.vmiLocationId || ""}
                    onChange={this.handleChange}
                >
                    <option value="">{translate("Show All")}</option>
                    {vmiLocations.map(vmiLocation => (
                        <option key={vmiLocation.id} value={vmiLocation.id}>
                            {vmiLocation.name}
                        </option>
                    ))}
                </Select>
            </SearchFieldWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldVmiLocation),
    definition: {
        group: "Order History",
        displayName: "VMI Location",
        allowedContexts: ["VmiOrderHistoryPage"],
    },
};

export default widgetModule;
