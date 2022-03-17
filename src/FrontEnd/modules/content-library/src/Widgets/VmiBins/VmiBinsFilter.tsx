import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { convertDateToDateOnlyString } from "@insite/client-framework/Common/Utilities/DateUtilities";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import clearSearch from "@insite/client-framework/Store/Pages/VmiBins/Handlers/ClearSearch";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiBins/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BinsPageContext } from "@insite/content-library/Pages/VmiBinsPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showProduct = "showProduct",
    showBinRange = "showBinRange",
    showDateRange = "showDateRange",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showProduct]: boolean;
        [fields.showBinRange]: boolean;
        [fields.showDateRange]: boolean;
    };
}

interface State {
    productSearch: string;
    binNumberFrom: string;
    binNumberTo: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.vmiBins.filtersOpen,
    getVmiBinsParameter: state.pages.vmiBins.getVmiBinsParameter,
});

const mapDispatchToProps = {
    updateSearchFields,
    clearSearch,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiBinsFilterStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    headingItem?: GridItemProps;
    productGridItem?: GridItemProps;
    productSearchText?: TextFieldProps;
    binNumberFromGridItem?: GridItemProps;
    binNumberFromText?: TextFieldProps;
    binNumberToGridItem?: GridItemProps;
    binNumberToText?: TextFieldProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

export const filterStyles: VmiBinsFilterStyles = {
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    headingItem: {
        width: 12,
        css: css`
            padding-bottom: 0;
        `,
    },
    heading: {
        variant: "h5",
        as: "h2",
        css: css`
            margin: 0;
        `,
    },
    productGridItem: { width: [12, 12, 6, 6, 4] },
    binNumberFromGridItem: { width: [6, 6, 3, 3, 2] },
    binNumberToGridItem: { width: [6, 6, 3, 3, 2] },
    fromGridItem: { width: [6, 6, 3, 3, 2] },
    toGridItem: { width: [6, 6, 3, 3, 2] },
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
    fromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
};

const styles = filterStyles;
class VmiBinsFilter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            productSearch: this.getValue(props, "filter"),
            binNumberFrom: this.getValue(props, "binNumberFrom"),
            binNumberTo: this.getValue(props, "binNumberTo"),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (props: Props, key: "filter" | "binNumberFrom" | "binNumberTo"): string => {
        let value = props.getVmiBinsParameter[key] as string;
        if (!value) {
            value = "";
        }
        return value;
    };

    componentDidMount() {}

    componentDidUpdate(prevProps: Props) {
        const previousFilter = this.getValue(prevProps, "filter");
        const currentFilter = this.getValue(this.props, "filter");
        const previousBinNumberFrom = this.getValue(prevProps, "binNumberFrom");
        const currentBinNumberFrom = this.getValue(this.props, "binNumberFrom");
        const previousBinNumberTo = this.getValue(prevProps, "binNumberTo");
        const currentBinNumberTo = this.getValue(this.props, "binNumberTo");

        if (
            (previousFilter !== currentFilter && currentFilter !== this.state.productSearch) ||
            (previousBinNumberFrom !== currentBinNumberFrom && currentBinNumberFrom !== this.state.binNumberFrom) ||
            (previousBinNumberTo !== currentBinNumberTo && currentBinNumberTo !== this.state.binNumberTo)
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                productSearch: currentFilter,
                binNumberFrom: currentBinNumberFrom,
                binNumberTo: currentBinNumberTo,
            });
        }
    }

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({
                filter: this.state.productSearch,
                binNumberFrom: this.state.binNumberFrom,
                binNumberTo: this.state.binNumberTo,
            });
        }, 250);
    };

    productChangeHandler = (productSearch: string) => {
        this.props.updateSearchFields({ filter: productSearch });
    };

    productSearchChangeHandler = (productSearch: string) => {
        this.setState({
            productSearch,
        });

        this.updateParameterAfterTimeout();
    };

    binNumberFromChangeHandler = (binNumberFrom: string) => {
        this.setState({
            binNumberFrom,
        });

        this.updateParameterAfterTimeout();
    };

    binNumberToChangeHandler = (binNumberTo: string) => {
        this.setState({
            binNumberTo,
        });

        this.updateParameterAfterTimeout();
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ previousCountFromDate: convertDateToDateOnlyString(selectedDay) });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ previousCountToDate: convertDateToDateOnlyString(selectedDay) });
    };

    clearFiltersClickHandler = () => {
        this.props.clearSearch();
    };

    render() {
        if (!this.props.filtersOpen) {
            return (
                <StyledWrapper {...styles.appliedFiltersContainer}>
                    {this.props.getVmiBinsParameter.filter && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.productChangeHandler("");
                            }}
                        >
                            {`${translate("Product")}: ${this.props.getVmiBinsParameter.filter}`}
                        </Tag>
                    )}
                    {this.props.getVmiBinsParameter.binNumberFrom && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.binNumberFromChangeHandler("");
                            }}
                        >
                            {`${translate("Bin # from")}: ${this.props.getVmiBinsParameter.binNumberFrom}`}
                        </Tag>
                    )}
                    {this.props.getVmiBinsParameter.binNumberTo && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.binNumberToChangeHandler("");
                            }}
                        >
                            {`${translate("Bin # to")}: ${this.props.getVmiBinsParameter.binNumberTo}`}
                        </Tag>
                    )}
                    {this.props.getVmiBinsParameter.previousCountFromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.fromDateChangeHandler({});
                            }}
                        >
                            {`${translate("From")}: ${this.props.getVmiBinsParameter.previousCountFromDate}`}
                        </Tag>
                    )}
                    {this.props.getVmiBinsParameter.previousCountToDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.toDateChangeHandler({});
                            }}
                        >
                            {`${translate("To")}: ${this.props.getVmiBinsParameter.previousCountToDate}`}
                        </Tag>
                    )}
                </StyledWrapper>
            );
        }

        const fromDate = this.props.getVmiBinsParameter.previousCountFromDate
            ? new Date(this.props.getVmiBinsParameter.previousCountFromDate.replace(/-/g, "/"))
            : undefined;
        const toDate = this.props.getVmiBinsParameter.previousCountToDate
            ? new Date(this.props.getVmiBinsParameter.previousCountToDate.replace(/-/g, "/"))
            : undefined;

        return (
            <GridContainer {...styles.container}>
                <GridItem {...styles.headingItem}>
                    <Typography {...styles.heading}>{translate("Filter")}</Typography>
                </GridItem>
                {this.props.fields.showProduct && (
                    <GridItem {...styles.productGridItem}>
                        <TextField
                            {...styles.productSearchText}
                            value={this.state.productSearch}
                            label={translate("Product")}
                            placeholder={translate("Search Products")}
                            onChange={event => this.productSearchChangeHandler(event.target.value)}
                        />
                    </GridItem>
                )}
                {this.props.fields.showBinRange && (
                    <>
                        <GridItem {...styles.binNumberFromGridItem}>
                            <TextField
                                {...styles.binNumberFromText}
                                value={this.state.binNumberFrom}
                                label={translate("Bin # from")}
                                onChange={event => this.binNumberFromChangeHandler(event.target.value)}
                            />
                        </GridItem>
                        <GridItem {...styles.binNumberToGridItem}>
                            <TextField
                                {...styles.binNumberToText}
                                value={this.state.binNumberTo}
                                label={translate("Bin # to")}
                                onChange={event => this.binNumberToChangeHandler(event.target.value)}
                            />
                        </GridItem>
                    </>
                )}
                {this.props.fields.showDateRange && (
                    <>
                        <GridItem {...styles.fromGridItem}>
                            <DatePicker
                                {...styles.fromDate}
                                label={translate("From")}
                                selectedDay={fromDate}
                                onDayChange={this.fromDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    maxDate: toDate,
                                    ...styles.fromDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                        <GridItem {...styles.toGridItem}>
                            <DatePicker
                                {...styles.toDate}
                                label={translate("To")}
                                selectedDay={toDate}
                                onDayChange={this.toDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    minDate: fromDate,
                                    ...styles.toDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                    </>
                )}
                <GridItem {...styles.buttonsItem}>
                    <Button {...styles.clearFiltersButton} onClick={this.clearFiltersClickHandler}>
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinsFilter),
    definition: {
        group: "VMI Bins",
        displayName: "Search Results Filter",
        allowedContexts: [BinsPageContext],
        fieldDefinitions: [
            {
                name: fields.showProduct,
                displayName: "Product",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showBinRange,
                displayName: "Bin Range",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showDateRange,
                displayName: "Date Range",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
        ],
    },
};

export default widgetModule;
