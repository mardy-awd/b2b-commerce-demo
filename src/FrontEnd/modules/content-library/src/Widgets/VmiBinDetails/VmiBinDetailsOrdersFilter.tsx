import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { convertDateToDateOnlyString } from "@insite/client-framework/Common/Utilities/DateUtilities";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadOrderStatusMappings from "@insite/client-framework/Store/Data/OrderStatusMappings/Handlers/LoadOrderStatusMappings";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import clearOrdersSearch from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ClearOrdersSearch";
import toggleOrdersFilterOpen from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ToggleOrdersFilterOpen";
import updateOrdersSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateOrdersSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Button, { ButtonPresentationProps, ButtonProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Search from "@insite/mobius/Icons/Search";
import Select, { SelectProps } from "@insite/mobius/Select";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.vmiBinDetails.ordersFilterOpen,
    getVmiOrdersParameter: state.pages.vmiBinDetails.getVmiOrdersParameter,
    orderStatusMappingDataView: getOrderStatusMappingDataView(state),
});

const mapDispatchToProps = {
    toggleOrdersFilterOpen,
    updateOrdersSearchFields,
    loadOrderStatusMappings,
    clearOrdersSearch,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinDetailsOrdersFilterStyles {
    statusContainer?: GridContainerProps;
    statusFilterGridItem?: GridItemProps;
    searchText?: TextFieldProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    filterContainer?: GridContainerProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
    searchButtonGridItem?: GridItemProps;
    searchButton?: ButtonPresentationProps;

    container?: GridContainerProps;
    statusGridItem?: GridItemProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    rangeGridItem?: GridItemProps;
    rangeText?: TypographyProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    selectStatus?: SelectProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

export const filterStyles: VmiBinDetailsOrdersFilterStyles = {
    statusContainer: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    statusFilterGridItem: { width: [12, 12, 12, 6, 4] },
    searchText: { iconProps: { src: Search } },
    appliedFiltersContainer: { css: horizontalStyles },
    filterContainer: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    toggleFilterGridItem: {
        width: 12,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
    searchButtonGridItem: { width: [12, 12, 12, 6, 4] },
    searchButton: { variant: "secondary" },
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    statusGridItem: { width: [12, 12, 6, 6, 4] },
    fromGridItem: { width: [5, 5, 3, 3, 2] },
    toGridItem: { width: [5, 5, 3, 3, 2] },
    rangeGridItem: {
        css: css`
            padding-left: 0;
            padding-right: 8px;
            flex-basis: fit-content;
        `,
    },
    toDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
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
    rangeText: {
        css: css`
            font-weight: 600;
            transform: scale(5, 1);
            margin-top: 38px;
        `,
    },
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
};

const styles = filterStyles;
const VmiBinDetailsOrdersFilter = ({
    filtersOpen,
    getVmiOrdersParameter,
    orderStatusMappingDataView,
    toggleOrdersFilterOpen,
    updateOrdersSearchFields,
    loadOrderStatusMappings,
    clearOrdersSearch,
}: Props) => {
    const [orderNumberText, setOrderNumberText] = useState(getVmiOrdersParameter.orderNumber);

    useEffect(() => {
        if (!orderStatusMappingDataView?.value && !orderStatusMappingDataView.isLoading) {
            loadOrderStatusMappings();
        }
    });

    const fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        updateOrdersSearchFields({ fromDate: convertDateToDateOnlyString(selectedDay) });
    };

    const toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        updateOrdersSearchFields({ toDate: convertDateToDateOnlyString(selectedDay) });
    };

    const statusChangeHandler = (event?: React.FormEvent<HTMLSelectElement>) => {
        if (event && event.currentTarget.value) {
            updateOrdersSearchFields({ status: event.currentTarget.value ? [event.currentTarget.value] : undefined });
        } else {
            updateOrdersSearchFields({ status: undefined });
        }
    };

    const searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.currentTarget.value;
        setOrderNumberText(searchText);
    };

    const handleSearch = () => {
        updateOrdersSearchFields({
            orderNumber: orderNumberText,
            page: 1,
        });
    };

    const clearFiltersClickHandler = () => {
        setOrderNumberText("");
        clearOrdersSearch();
    };

    const BasicFilterBlock = (
        <>
            <GridContainer {...styles.filterContainer}>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={() => toggleOrdersFilterOpen()}>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
            <GridContainer {...styles.statusContainer}>
                <GridItem {...styles.statusFilterGridItem}>
                    <TextField
                        placeholder={translate("Search Orders")}
                        {...styles.searchText}
                        value={orderNumberText}
                        onChange={searchTextChangeHandler}
                    />
                </GridItem>
                <GridItem {...styles.searchButtonGridItem}>
                    <Button {...styles.searchButton} onClick={handleSearch}>
                        {translate("Search")}
                    </Button>
                </GridItem>
            </GridContainer>
        </>
    );

    if (!filtersOpen) {
        return (
            <>
                {BasicFilterBlock}
                <StyledWrapper {...styles.appliedFiltersContainer}>
                    {getVmiOrdersParameter.fromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                fromDateChangeHandler({});
                            }}
                        >
                            {`${translate("From")}: ${getVmiOrdersParameter.fromDate}`}
                        </Tag>
                    )}
                    {getVmiOrdersParameter.toDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                toDateChangeHandler({});
                            }}
                        >
                            {`${translate("To")}: ${getVmiOrdersParameter.toDate}`}
                        </Tag>
                    )}
                    {getVmiOrdersParameter.status && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                statusChangeHandler();
                            }}
                        >
                            {`${translate("Status")}: ${getVmiOrdersParameter.status}`}
                        </Tag>
                    )}
                </StyledWrapper>
            </>
        );
    }

    const fromDate = getVmiOrdersParameter.fromDate
        ? new Date(getVmiOrdersParameter.fromDate.replace(/-/g, "/"))
        : undefined;
    const toDate = getVmiOrdersParameter.toDate ? new Date(getVmiOrdersParameter.toDate.replace(/-/g, "/")) : undefined;

    const options = orderStatusMappingDataView.value || [];
    const uniqueOptions = new Map<string, string[]>();
    for (const option of options) {
        const erpOrderStatuses = uniqueOptions.get(option.displayName) || [];
        erpOrderStatuses.push(option.erpOrderStatus);
        uniqueOptions.set(option.displayName, erpOrderStatuses);
    }

    const value =
        getVmiOrdersParameter.status && getVmiOrdersParameter.status.length ? getVmiOrdersParameter.status[0] : "";

    return (
        <>
            {BasicFilterBlock}
            <GridContainer {...styles.container}>
                <GridItem {...styles.fromGridItem}>
                    <DatePicker
                        {...styles.fromDate}
                        label={translate("Order Date Range")}
                        selectedDay={fromDate}
                        onDayChange={fromDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            maxDate: toDate,
                            ...styles.fromDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.rangeGridItem}>
                    <Typography {...styles.rangeText}>-</Typography>
                </GridItem>
                <GridItem {...styles.toGridItem}>
                    <DatePicker
                        {...styles.toDate}
                        label=" "
                        selectedDay={toDate}
                        onDayChange={toDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            minDate: fromDate,
                            ...styles.toDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.statusGridItem}>
                    <Select
                        label={translate("Status")}
                        {...styles.selectStatus}
                        value={value}
                        onChange={statusChangeHandler}
                    >
                        <option value="">{translate("Select")}</option>
                        {Array.from(uniqueOptions, ([name, values]) => ({ name, values })).map(option => (
                            <option key={option.values.join(",")} value={option.values.join(",")}>
                                {option.name}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                <GridItem {...styles.buttonsItem}>
                    <Button {...styles.clearFiltersButton} onClick={clearFiltersClickHandler}>
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsOrdersFilter),
    definition: {
        group: "VMI Bin Details",
        displayName: "Search Orders Result Filter",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
