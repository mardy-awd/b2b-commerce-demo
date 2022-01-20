import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import getAutocompleteModel from "@insite/client-framework/Store/CommonHandlers/GetAutocompleteModel";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { VmiReportingPageContext } from "@insite/content-library/Pages/VmiReportingPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface State {
    metric: string;
    numberOfPreviousOrders: number | undefined;
    numberOfTimesMinQtyReached: number | undefined;
    numberOfVisits: number | undefined;
}

const mapStateToProps = (state: ApplicationState) => ({
    getVmiBinsParameter: state.pages.vmiReporting.getVmiBinsParameter,
});

const mapDispatchToProps = {
    getAutocompleteModel,
    updateSearchFields,
};

export interface VmiBinsMetricFilterStyles {
    container?: GridContainerProps;
    metricSelectGridItem?: GridItemProps;
    select?: SelectProps;
    filtersGridItem?: GridItemProps;
    labelWrapper?: InjectableCss;
    labelText?: TypographyPresentationProps;
    resetLink?: LinkPresentationProps;
    filterWrapper?: InjectableCss;
    filterTextField?: TextFieldPresentationProps;
}

export const vmiBinsMetricFilterStyles: VmiBinsMetricFilterStyles = {
    metricSelectGridItem: { width: [6, 6, 5, 3, 3] },
    filtersGridItem: {
        width: [12, 12, 12, 9, 9],
        css: css`
            flex-direction: column;
        `,
    },
    labelWrapper: {
        css: css`
            display: flex;
        `,
    },
    labelText: {
        variant: "h6",
        css: css`
            margin-bottom: 0.5rem;
        `,
    },
    resetLink: {
        css: css`
            margin-left: 100px;
        `,
    },
    filterWrapper: {
        css: css`
            display: flex;
        `,
    },
    filterTextField: {
        labelProps: {
            variant: "p",
            size: 14,
            css: css`
                white-space: break-spaces;
                padding: 0 10px 0 0;
                text-align: left;
                width: fit-content;
            `,
        },
        cssOverrides: {
            inputSelect: css`
                width: 65px;
            `,
            formInputWrapper: css`
                margin-right: 10px;
                width: auto;
            `,
            formField: css`
                width: auto;
                align-items: center;
            `,
        },
    },
};
const styles = vmiBinsMetricFilterStyles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class VmiBinsMetricFilter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            metric: "All Products",
            numberOfPreviousOrders: this.getValue(props, "numberOfPreviousOrders"),
            numberOfTimesMinQtyReached: this.getValue(props, "numberOfTimesMinQtyReached"),
            numberOfVisits: this.getValue(props, "numberOfVisits"),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (
        props: Props,
        key: "numberOfPreviousOrders" | "numberOfTimesMinQtyReached" | "numberOfVisits",
    ): number | undefined => {
        let value = props.getVmiBinsParameter[key] as number | undefined;
        if (!value) {
            value = undefined;
        }
        return value;
    };

    metricChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({ metric: event.currentTarget.value });
        setTimeout(this.resetFilter, 250);
    };

    resetFilter = () => {
        this.setState({
            numberOfPreviousOrders: 0,
            numberOfTimesMinQtyReached: 2,
            numberOfVisits: this.state.metric === "Slow Moving" ? 2 : 4,
        });
        this.updateParameterAfterTimeout();
    };

    numberOfPreviousOrdersChangeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ numberOfPreviousOrders: Number(event.currentTarget.value) });
        this.updateParameterAfterTimeout();
    };

    numberOfTimesMinQtyReachedChangeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ numberOfTimesMinQtyReached: Number(event.currentTarget.value) });
        this.updateParameterAfterTimeout();
    };

    numberOfVisitsChangeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ numberOfVisits: Number(event.currentTarget.value) });
        this.updateParameterAfterTimeout();
    };

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            const { metric, numberOfPreviousOrders, numberOfTimesMinQtyReached, numberOfVisits } = this.state;
            this.props.updateSearchFields({
                isBelowMinimum: metric === "Below Minimum",
                numberOfPreviousOrders: metric === "Slow Moving" ? numberOfPreviousOrders : undefined,
                numberOfTimesMinQtyReached: metric === "Fast Moving" ? numberOfTimesMinQtyReached : undefined,
                numberOfVisits: metric === "Fast Moving" || metric === "Slow Moving" ? numberOfVisits : undefined,
            });
        }, 250);
    };

    render() {
        const metricOptions = ["All Products", "Below Minimum", "Slow Moving", "Fast Moving"];
        const { metric, numberOfPreviousOrders, numberOfTimesMinQtyReached, numberOfVisits } = this.state;

        return (
            <GridContainer {...styles.container}>
                <GridItem {...styles.metricSelectGridItem}>
                    <Select
                        label={translate("Metric")}
                        {...styles.select}
                        value={metric}
                        onChange={this.metricChangeHandler}
                    >
                        {metricOptions.map(option => (
                            <option key={option} value={option}>
                                {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                                {translate(option)}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                {(metric === "Slow Moving" || metric === "Fast Moving") && (
                    <GridItem {...styles.filtersGridItem}>
                        <StyledWrapper {...styles.labelWrapper}>
                            <Typography as="h5" {...styles.labelText}>
                                {metric === "Slow Moving"
                                    ? translate("Filter Slow Moving Products")
                                    : translate("Filter Fast Moving Products")}
                            </Typography>
                            <Link {...styles.resetLink} onClick={this.resetFilter}>
                                {translate("Reset to defaults")}
                            </Link>
                        </StyledWrapper>
                        <StyledWrapper {...styles.filterWrapper}>
                            {metric === "Slow Moving" && (
                                <TextField
                                    label={translate("# of previous orders")}
                                    value={numberOfPreviousOrders}
                                    type="number"
                                    labelPosition="left"
                                    onChange={this.numberOfPreviousOrdersChangeHandler}
                                    {...styles.filterTextField}
                                ></TextField>
                            )}
                            {metric === "Fast Moving" && (
                                <TextField
                                    label={translate("# of times min. QTY reached")}
                                    value={numberOfTimesMinQtyReached}
                                    type="number"
                                    labelPosition="left"
                                    onChange={this.numberOfTimesMinQtyReachedChangeHandler}
                                    {...styles.filterTextField}
                                ></TextField>
                            )}
                            <TextField
                                label={translate("# of visits")}
                                value={numberOfVisits}
                                type="number"
                                labelPosition="left"
                                onChange={this.numberOfVisitsChangeHandler}
                                {...styles.filterTextField}
                            ></TextField>
                        </StyledWrapper>
                    </GridItem>
                )}
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiBinsMetricFilter),
    definition: {
        group: "VMI Reporting",
        allowedContexts: [VmiReportingPageContext],
    },
};

export default widgetModule;
