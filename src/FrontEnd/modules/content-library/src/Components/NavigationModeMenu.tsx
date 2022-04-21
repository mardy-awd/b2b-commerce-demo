import { getCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import { setCookie } from "@insite/mobius/utilities/cookies";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

export const NavigationModeCookieName = "NavigationMode";

interface OwnProps {
    extendedStyles?: NavigationModeMenuStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const isAuthenticated = session.isAuthenticated && !session.isGuest;
    const vmiEnabled = getSettingsCollection(state).orderSettings.vmiEnabled;
    return {
        currentMode: getCookie(NavigationModeCookieName) || "Storefront",
        displayModeSwitch:
            isAuthenticated &&
            vmiEnabled &&
            session.userRoles &&
            session.userRoles.toLowerCase().indexOf("vmi_admin") !== -1,
        vmiDashboardPageUrl: getPageLinkByPageType(state, "VmiDashboardPage")?.url,
        homePageUrl: getPageLinkByPageType(state, "HomePage")?.url,
    };
};

export interface NavigationModeMenuStyles {
    currencyWrapper?: InjectableCss;
    navigationModeSelect?: SelectPresentationProps;
}

export const navigationModeMenuStyles: NavigationModeMenuStyles = {
    currencyWrapper: {
        css: css`
            display: flex;
        `,
    },
    navigationModeSelect: {
        backgroundColor: "common.accent",
        cssOverrides: {
            formInputWrapper: css`
                width: 271px;
            `,
            inputSelect: css`
                border: none;
                text-transform: uppercase;
            `,
        },
    },
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasHistory;

export const NavigationModeMenu = ({
    currentMode,
    displayModeSwitch,
    vmiDashboardPageUrl,
    homePageUrl,
    history,
}: Props) => {
    if (!displayModeSwitch) {
        return null;
    }

    const styles = useMergeStyles("navigationModeMenu", navigationModeMenuStyles);

    const navigationModeChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.currentTarget.value;
        setCookie(NavigationModeCookieName, value);
        if (value === "Vmi") {
            vmiDashboardPageUrl && history.push(vmiDashboardPageUrl);
        } else {
            homePageUrl && history.push(homePageUrl);
        }
    };

    const menuId = "navigationModeMenu";

    return (
        <StyledWrapper {...styles.currencyWrapper}>
            <VisuallyHidden as="label" id={`${menuId}-label`} htmlFor={menuId}>
                {translate("Navigation Mode")}
            </VisuallyHidden>
            <Select
                {...styles.navigationModeSelect}
                uid={menuId}
                onChange={navigationModeChangeHandler}
                value={currentMode}
                autoComplete="off"
                hasLabel
            >
                <option value="Storefront" key="Storefront">
                    {translate("Storefront")}
                </option>
                <option value="Vmi" key="Vendor Managed Inventory">
                    {translate("Vendor Managed Inventory")}
                </option>
            </Select>
        </StyledWrapper>
    );
};

export default withHistory(connect(mapStateToProps)(NavigationModeMenu));
