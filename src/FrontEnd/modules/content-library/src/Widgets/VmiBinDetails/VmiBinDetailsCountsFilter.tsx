import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import clearCountsSearch from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ClearCountsSearch";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/ToggleCountsFilterOpen";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateCountsSearchFields";
import updateUserSearchFields from "@insite/client-framework/Store/Pages/VmiBinDetails/Handlers/UpdateUserSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import SearchUserField from "@insite/content-library/Widgets/VmiBinDetails/SearchUserField";
import Button, { ButtonProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.vmiBinDetails.countsFilterOpen,
    getVmiCountsParameter: state.pages.vmiBinDetails.getVmiCountsParameter,
});

const mapDispatchToProps = {
    toggleFiltersOpen,
    updateSearchFields,
    updateUserSearchFields,
    clearCountsSearch,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinDetailsCountsFilterStyles {
    container?: GridContainerProps;
    userGridItem?: GridItemProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    rangeGridItem?: GridItemProps;
    rangeText?: TypographyProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    filterContainer?: GridContainerProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

export const filterStyles: VmiBinDetailsCountsFilterStyles = {
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    userGridItem: { width: [12, 12, 6, 6, 4] },
    fromGridItem: { width: [5, 5, 3, 3, 2] },
    toGridItem: { width: [5, 5, 3, 3, 2] },
    rangeGridItem: {
        css: css`
            padding-left: 0;
            padding-right: 8px;
            flex-basis: fit-content;
        `,
    },
    appliedFiltersContainer: { css: horizontalStyles },
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
    filterContainer: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    rangeText: {
        css: css`
            font-weight: 600;
            transform: scale(5, 1);
            margin-top: 38px;
        `,
    },
    toggleFilterGridItem: {
        width: 12,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
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
const tzOffset = new Date().getTimezoneOffset() * 60000;
class VmiBinDetailsCountsFilter extends React.Component<Props> {
    userChangeHandler = (userSearch: string) => {
        this.props.updateSearchFields({ userName: userSearch });
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            previousCountFromDate: selectedDay
                ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0]
                : "",
        });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            previousCountToDate: selectedDay
                ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0]
                : "",
        });
    };

    clearFiltersClickHandler = () => {
        this.props.clearCountsSearch();
    };

    render() {
        const FilterIconBlock = (
            <GridContainer {...styles.filterContainer}>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={this.props.toggleFiltersOpen}>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        );

        if (!this.props.filtersOpen) {
            return (
                <>
                    {FilterIconBlock}
                    <StyledWrapper {...styles.appliedFiltersContainer}>
                        {this.props.getVmiCountsParameter.previousCountFromDate && (
                            <Tag
                                {...styles.appliedFilterTag}
                                onDelete={() => {
                                    this.fromDateChangeHandler({});
                                }}
                            >
                                {`${translate("From")}: ${this.props.getVmiCountsParameter.previousCountFromDate}`}
                            </Tag>
                        )}
                        {this.props.getVmiCountsParameter.previousCountToDate && (
                            <Tag
                                {...styles.appliedFilterTag}
                                onDelete={() => {
                                    this.toDateChangeHandler({});
                                }}
                            >
                                {`${translate("To")}: ${this.props.getVmiCountsParameter.previousCountToDate}`}
                            </Tag>
                        )}
                        {this.props.getVmiCountsParameter.userName && (
                            <Tag
                                {...styles.appliedFilterTag}
                                onDelete={() => {
                                    this.userChangeHandler("");
                                }}
                            >
                                {`${translate("User")}: ${this.props.getVmiCountsParameter.userName}`}
                            </Tag>
                        )}
                    </StyledWrapper>
                </>
            );
        }

        const fromDate = this.props.getVmiCountsParameter.previousCountFromDate
            ? new Date(this.props.getVmiCountsParameter.previousCountFromDate.replace(/-/g, "/"))
            : undefined;
        const toDate = this.props.getVmiCountsParameter.previousCountToDate
            ? new Date(this.props.getVmiCountsParameter.previousCountToDate.replace(/-/g, "/"))
            : undefined;

        return (
            <>
                {FilterIconBlock}
                <GridContainer {...styles.container}>
                    <GridItem {...styles.fromGridItem}>
                        <DatePicker
                            {...styles.fromDate}
                            label={translate("Last Count Date")}
                            selectedDay={fromDate}
                            onDayChange={this.fromDateChangeHandler}
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
                            onDayChange={this.toDateChangeHandler}
                            dateTimePickerProps={{
                                clearIcon: null,
                                minDate: fromDate,
                                ...styles.toDate?.dateTimePickerProps,
                            }}
                        />
                    </GridItem>
                    <GridItem {...styles.userGridItem}>
                        <SearchUserField />
                    </GridItem>
                    <GridItem {...styles.buttonsItem}>
                        <Button {...styles.clearFiltersButton} onClick={this.clearFiltersClickHandler}>
                            {translate("Clear Filters")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinDetailsCountsFilter),
    definition: {
        group: "VMI Bin Details",
        displayName: "Search Counts Result Filter",
        allowedContexts: ["VmiBinDetailsPage"],
    },
};

export default widgetModule;
