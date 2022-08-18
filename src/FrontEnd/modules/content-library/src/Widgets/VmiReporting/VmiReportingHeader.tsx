import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getVmiLocationsDataView } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/ToggleFiltersOpen";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiReporting/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const getVmiLocationsParameter = {
        ...state.pages.vmiLocations.getVmiLocationsParameter,
        page: 1,
        pageSize: 9999, // need to get all locations
    };

    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ locationid?: string }>(location.search?.toLowerCase());

    return {
        vmiLocationsDataView: getVmiLocationsDataView(state, getVmiLocationsParameter),
        vmiReportingPageUrl: getPageLinkByPageType(state, "VmiReportingPage")?.url,
        vmiLocationId: state.pages.vmiReporting.getVmiBinsParameter.vmiLocationId,
        parsedQuery,
    };
};

const mapDispatchToProps = {
    toggleFiltersOpen,
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface VmiLocationsHeaderStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    container?: GridContainerProps;
    locationSwitcherGridItem?: GridItemProps;
    locationSelect?: SelectPresentationProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: VmiLocationsHeaderStyles = {
    centeringWrapper: {
        css: css`
            height: 100px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    titleGridItem: {
        width: [11, 9, 7, 5, 6],
    },
    titleText: {
        variant: "h2",
    },
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    locationSwitcherGridItem: {
        width: [12, 12, 11, 11, 11],
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    locationSelect: {
        cssOverrides: {
            formInputWrapper: css`
                width: 200px;
                align-self: end;
            `,
            inputSelect: css`
                text-transform: uppercase;
            `,
        },
    },
    toggleFilterGridItem: {
        width: [12, 12, 1, 1, 1],
        style: { marginTop: "8px", justifyContent: "flex-end", alignSelf: "center" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = headerStyles;

const VmiReportingHeader = ({
    vmiLocationsDataView,
    vmiLocationId,
    parsedQuery,
    vmiReportingPageUrl,
    toggleFiltersOpen,
    updateSearchFields,
    history,
}: Props) => {
    const setLocation = (locationId: string) => {
        if (vmiReportingPageUrl) {
            history.push(`${vmiReportingPageUrl}${locationId ? `?locationId=${locationId}` : ""}`);
            if (!locationId) {
                updateSearchFields({ vmiLocationId: undefined });
            }
        }
    };

    if (!vmiLocationsDataView.value || vmiLocationsDataView.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    const vmiLocations = vmiLocationsDataView;
    let currentLocation = null;
    if (vmiLocations?.value && vmiLocations.value.length > 0) {
        const locationId = parsedQuery?.locationid?.toLowerCase() || vmiLocationId;
        currentLocation = locationId
            ? vmiLocations.value.find((location: any) => location.id?.toLowerCase() === locationId)
            : null;
    }

    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Typography as="h2" {...styles.titleText}>
                        {translate("Reporting")}
                    </Typography>
                </GridItem>
            </GridContainer>
            <GridContainer {...styles.container}>
                {vmiLocations && vmiLocations.value && (
                    <GridItem {...styles.locationSwitcherGridItem}>
                        <Select
                            {...styles.locationSelect}
                            data-test-selector="locationSelector"
                            onChange={event => setLocation(event.currentTarget.value)}
                            value={currentLocation?.id ?? ""}
                            hasLabel
                        >
                            <option value="">{translate("Select Location")}</option>
                            {vmiLocations.value.map(c => (
                                <option value={c.id} key={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                )}
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={() => toggleFiltersOpen()}>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(VmiReportingHeader)),
    definition: {
        group: "VMI Reporting",
        allowedContexts: ["VmiReportingPage"],
    },
};

export default widgetModule;
