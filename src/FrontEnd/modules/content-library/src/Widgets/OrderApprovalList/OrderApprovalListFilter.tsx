import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import {
    convertDateOnlyStringToDate,
    convertDateToDateOnlyString,
} from "@insite/client-framework/Common/Utilities/DateUtilities";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import clearSearch from "@insite/client-framework/Store/Pages/OrderApprovalList/Handlers/ClearSearch";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderApprovalList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface State {
    orderNumber: string;
    orderTotal: string;
    orderTotalOperator: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.orderApprovalList.filtersOpen,
    currentShipTosDataView: getCurrentShipTosDataView(state),
    getOrderApprovalsParameter: state.pages.orderApprovalList.getOrderApprovalsParameter,
});

const mapDispatchToProps = {
    loadCurrentShipTos,
    updateSearchFields,
    clearSearch,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderApprovalListFilterStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    heading?: TypographyPresentationProps;
    shipToGridItem?: GridItemProps;
    shipToSelect?: SelectPresentationProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberTextField?: TextFieldPresentationProps;
    datesGridItem?: GridItemProps;
    datesContainer?: GridContainerProps;
    dateRangeFieldset?: InjectableCss;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    orderTotalGridItem?: GridItemProps;
    orderTotalContainer?: GridContainerProps;
    orderTotalFieldset?: InjectableCss;
    orderTotalOperatorGridItem?: GridItemProps;
    orderTotalOperatorSelect?: SelectPresentationProps;
    orderTotalAmountGridItem?: GridItemProps;
    orderTotalAmountTextField?: TextFieldPresentationProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonPresentationProps;
}

export const filterStyles: OrderApprovalListFilterStyles = {
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    headingGridItem: {
        width: 12,
        css: css`
            padding-bottom: 0;
        `,
    },
    heading: {
        variant: "h5",
        css: css`
            margin: 0;
        `,
    },
    shipToGridItem: { width: [12, 12, 5, 5, 4] },
    orderNumberGridItem: { width: [12, 12, 3, 3, 2] },
    datesGridItem: { width: [12, 12, 6, 4, 4] },
    datesContainer: { gap: 10 },
    dateRangeFieldset: {
        css: css`
            border: none;
            margin: 0;
            padding: 0;
            width: 100%;
        `,
    },
    fromGridItem: { width: 6 },
    toGridItem: { width: 6 },
    appliedFiltersContainer: { css: horizontalStyles },
    buttonsItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    clearFiltersButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
    toDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    orderTotalGridItem: { width: 12 },
    orderTotalContainer: { gap: 10 },
    orderTotalFieldset: {
        css: css`
            border: none;
            margin: 0;
            padding: 0;
            width: 100%;
        `,
    },
    orderTotalOperatorGridItem: { width: [6, 6, 3, 3, 2] },
    orderTotalAmountGridItem: { width: [6, 6, 3, 3, 2] },
    orderTotalAmountTextField: {
        cssOverrides: {
            formInputWrapper: css`
                margin-top: 32px;
            `,
        },
    },
    fromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
};

const StyledDateRangeFieldSet = getStyledWrapper("fieldset");
const StyledOrderTotalFieldSet = getStyledWrapper("fieldset");

export const styles = filterStyles;
class OrderApprovalListFilter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            orderNumber: this.getValue(props, "orderNumber"),
            orderTotal: this.getValue(props, "orderTotal"),
            orderTotalOperator: this.getValue(props, "orderTotalOperator"),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (props: Props, key: "orderNumber" | "orderTotal" | "orderTotalOperator"): string => {
        let value = props.getOrderApprovalsParameter[key] as string;
        if (!value) {
            value = "";
        }
        return value;
    };

    componentDidMount() {
        if (!this.props.currentShipTosDataView.value) {
            this.props.loadCurrentShipTos();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const previousOrderNumber = this.getValue(prevProps, "orderNumber");
        const currentOrderNumber = this.getValue(this.props, "orderNumber");
        const previousOrderTotal = this.getValue(prevProps, "orderTotal");
        const currentOrderTotal = this.getValue(this.props, "orderTotal");
        const previousOrderTotalOperator = this.getValue(prevProps, "orderTotalOperator");
        const currentOrderTotalOperator = this.getValue(this.props, "orderTotalOperator");

        if (previousOrderNumber !== currentOrderNumber && currentOrderNumber !== this.state.orderNumber) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                orderNumber: currentOrderNumber,
            });
        }

        if (
            previousOrderTotal !== currentOrderTotal &&
            currentOrderTotal !== this.state.orderTotal &&
            previousOrderTotalOperator !== currentOrderTotalOperator &&
            currentOrderTotalOperator !== this.state.orderTotalOperator
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                orderTotal: currentOrderTotal,
                orderTotalOperator: currentOrderTotalOperator,
            });
        }
    }

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            const setOrderTotalFilter = this.state.orderTotal && this.state.orderTotalOperator;
            this.props.updateSearchFields({
                orderNumber: this.state.orderNumber,
                orderTotal: setOrderTotalFilter ? this.state.orderTotal : "",
                orderTotalOperator: setOrderTotalFilter ? this.state.orderTotalOperator : "",
            });
        }, 250);
    };

    shipToChangeHandler = (shipToId: string) => {
        this.props.updateSearchFields({ shipToId: shipToId || "" });
    };

    orderNumberChangeHandler = (orderNumber: string) => {
        this.setState({ orderNumber });
        this.updateParameterAfterTimeout();
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            fromDate: convertDateToDateOnlyString(selectedDay),
        });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            toDate: convertDateToDateOnlyString(selectedDay),
        });
    };

    orderTotalOperatorChangeHandler = (operator: string) => {
        this.setState({ orderTotalOperator: operator });
        this.updateParameterAfterTimeout();
    };

    orderTotalChangeHandler = (orderTotal: string) => {
        this.setState({ orderTotal });
        this.updateParameterAfterTimeout();
    };

    clearFiltersClickHandler = () => {
        this.setState({ orderTotalOperator: "" });
        this.setState({ orderTotal: "" });
        this.props.clearSearch();
    };

    render() {
        const currentShipTos = this.props.currentShipTosDataView.value || [];
        const { shipToId, orderNumber, fromDate, toDate, orderTotalOperator, orderTotal } =
            this.props.getOrderApprovalsParameter;

        if (!this.props.filtersOpen) {
            const selectedShipTo = currentShipTos.find(o => o.id === shipToId);
            return (
                <StyledWrapper {...styles.appliedFiltersContainer}>
                    {selectedShipTo && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.shipToChangeHandler("");
                            }}
                        >
                            {`${translate("Ship to Address")}: ${selectedShipTo.label}`}
                        </Tag>
                    )}
                    {orderNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.orderNumberChangeHandler("");
                            }}
                        >
                            {`${translate("Order #")}: ${orderNumber}`}
                        </Tag>
                    )}
                    {fromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.fromDateChangeHandler({});
                            }}
                        >
                            {`${translate("From")}: ${fromDate}`}
                        </Tag>
                    )}
                    {toDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.toDateChangeHandler({});
                            }}
                        >
                            {`${translate("To")}: ${toDate}`}
                        </Tag>
                    )}
                    {orderTotalOperator && orderTotal && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.orderTotalOperatorChangeHandler("");
                                this.orderTotalChangeHandler("");
                            }}
                        >
                            {`${translate("Order Total")}: ${orderTotalOperator} ${orderTotal}`}
                        </Tag>
                    )}
                </StyledWrapper>
            );
        }

        const fromDateObj = convertDateOnlyStringToDate(fromDate);
        const toDateObj = convertDateOnlyStringToDate(toDate);

        return (
            <GridContainer {...styles.container}>
                <GridItem {...styles.headingGridItem}>
                    <Typography {...styles.heading} as="h2">
                        {translate("Filter")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.shipToGridItem}>
                    <Select
                        {...styles.shipToSelect}
                        label={translate("Ship to Address")}
                        value={shipToId || ""}
                        onChange={event => this.shipToChangeHandler(event.target.value)}
                    >
                        {currentShipTos.map(shipTo => (
                            <option key={shipTo.id} value={shipTo.id}>
                                {shipTo.label}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                <GridItem {...styles.orderNumberGridItem}>
                    <TextField
                        {...styles.orderNumberTextField}
                        value={this.state.orderNumber}
                        label={translate("Order #")}
                        data-test-selector="orderApproval_orderNumberFilter"
                        onChange={event => this.orderNumberChangeHandler(event.target.value)}
                    />
                </GridItem>
                <GridItem {...styles.datesGridItem}>
                    <StyledDateRangeFieldSet {...styles.dateRangeFieldset}>
                        <VisuallyHidden as="label">{translate("Date Range")}</VisuallyHidden>
                        <GridContainer {...styles.datesContainer}>
                            <GridItem data-test-selector="orderApproval_fromDateFilter" {...styles.fromGridItem}>
                                <DatePicker
                                    {...styles.fromDate}
                                    label={translate("From")}
                                    selectedDay={fromDateObj}
                                    onDayChange={this.fromDateChangeHandler}
                                    dateTimePickerProps={{
                                        clearIcon: null,
                                        maxDate: toDateObj,
                                        ...styles.fromDate?.dateTimePickerProps,
                                    }}
                                />
                            </GridItem>
                            <GridItem data-test-selector="orderApproval_toDateFilter" {...styles.toGridItem}>
                                <DatePicker
                                    {...styles.toDate}
                                    label={translate("To")}
                                    selectedDay={toDateObj}
                                    onDayChange={this.toDateChangeHandler}
                                    dateTimePickerProps={{
                                        clearIcon: null,
                                        minDate: fromDateObj,
                                        ...styles.toDate?.dateTimePickerProps,
                                    }}
                                />
                            </GridItem>
                        </GridContainer>
                    </StyledDateRangeFieldSet>
                </GridItem>
                <GridItem {...styles.orderTotalGridItem}>
                    <StyledOrderTotalFieldSet {...styles.orderTotalFieldset}>
                        <VisuallyHidden as="label">{translate("Order Total")}</VisuallyHidden>
                        <GridContainer {...styles.orderTotalContainer}>
                            <GridItem {...styles.orderTotalOperatorGridItem}>
                                <Select
                                    {...styles.orderTotalOperatorSelect}
                                    label={translate("Order Total")}
                                    value={this.state.orderTotalOperator || ""}
                                    data-test-selector="orderApproval_comparisonMethod"
                                    onChange={event => this.orderTotalOperatorChangeHandler(event.target.value)}
                                >
                                    <option value="">{translate("Select")}</option>
                                    <option key="Greater Than" value="Greater Than">
                                        {translate("Greater Than")}
                                    </option>
                                    <option key="Less Than" value="Less Than">
                                        {translate("Less Than")}
                                    </option>
                                    <option key="Equal To" value="Equal To">
                                        {translate("Equal To")}
                                    </option>
                                </Select>
                            </GridItem>
                            <GridItem {...styles.orderTotalAmountGridItem}>
                                <TextField
                                    {...styles.orderTotalAmountTextField}
                                    value={this.state.orderTotal || ""}
                                    data-test-selector="orderApproval_comparisonValue"
                                    onChange={event => this.orderTotalChangeHandler(event.target.value)}
                                />
                            </GridItem>
                        </GridContainer>
                    </StyledOrderTotalFieldSet>
                </GridItem>
                <GridItem {...styles.buttonsItem}>
                    <Button
                        {...styles.clearFiltersButton}
                        data-test-selector="orderApproval_clearFiltersButton"
                        onClick={this.clearFiltersClickHandler}
                    >
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderApprovalListFilter),
    definition: {
        group: "Order Approval List",
        displayName: "Search Results Filter",
        allowedContexts: ["OrderApprovalListPage"],
        isSystem: true,
    },
};

export default widgetModule;
