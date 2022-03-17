import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    convertDateOnlyStringToDate,
    convertDateToDateOnlyString,
} from "@insite/client-framework/Common/Utilities/DateUtilities";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistoryDateRangeStyles {
    searchFieldWrapper?: SearchFieldWrapperStyles;
    datePickersWrapper?: InjectableCss;
    fromDate?: DatePickerPresentationProps;
    toDate?: DatePickerPresentationProps;
}

export const dateRangeStyles: OrderHistoryDateRangeStyles = {
    datePickersWrapper: {
        css: css`
            display: flex;
        `,
    },
    fromDate: {
        cssOverrides: {
            inputSelect: css`
                width: 100%;
            `,
            formField: css`
                padding-right: 5px;
            `,
        },
    },
    toDate: {
        cssOverrides: {
            inputSelect: css`
                width: 100%;
            `,
            formField: css`
                padding-left: 5px;
            `,
        },
        labelProps: {
            color: "common.background",
        },
    },
};

const styles = dateRangeStyles;
const OrderHistorySearchFieldDateRange: React.FunctionComponent<Props> = props => {
    const fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        const loadParameter = {
            ...props.parameter,
            fromDate: convertDateToDateOnlyString(selectedDay),
        };

        props.updateSearchFields(loadParameter);
    };

    const toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        const loadParameter = {
            ...props.parameter,
            toDate: convertDateToDateOnlyString(selectedDay),
        };
        props.updateSearchFields(loadParameter);
    };

    const fromDate = convertDateOnlyStringToDate(props.parameter.fromDate);
    const toDate = convertDateOnlyStringToDate(props.parameter.toDate);

    return (
        <SearchFieldWrapper extendedStyles={styles.searchFieldWrapper}>
            <StyledWrapper {...styles.datePickersWrapper} data-test-selector="orderHistory_filterDateRange">
                <DatePicker
                    data-test-selector="orderHistory_filterFromDate"
                    {...styles.fromDate}
                    label={translate("Date Range")}
                    selectedDay={fromDate}
                    onDayChange={fromDateChangeHandler}
                    dateTimePickerProps={{
                        clearIcon: null,
                        maxDate: toDate,
                        ...styles.fromDate?.dateTimePickerProps,
                    }}
                />
                <DatePicker
                    data-test-selector="orderHistory_filterToDate"
                    {...styles.toDate}
                    label={translate("To")}
                    selectedDay={toDate}
                    onDayChange={toDateChangeHandler}
                    dateTimePickerProps={{
                        clearIcon: null,
                        minDate: fromDate,
                        ...styles.toDate?.dateTimePickerProps,
                    }}
                />
            </StyledWrapper>
        </SearchFieldWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldDateRange),
    definition: {
        group: "Order History",
        allowedContexts: ["OrderHistoryPage", "VmiOrderHistoryPage"],
        displayName: "Date Range",
    },
};

export default widgetModule;
