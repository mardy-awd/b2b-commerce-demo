/* eslint-disable spire/export-styles */
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import NavigationModeMenu, { NavigationModeMenuStyles } from "@insite/content-library/Components/NavigationModeMenu";
import Hidden from "@insite/mobius/Hidden";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as cssLinter from "css";
import React, { FC } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";

const enum fields {
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.customCSS]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const Navigation = styled.div`
    color: ${getContrastColor("common.accent")};
    font-size: 15px;
    background-color: ${getColor("common.accent")};
    padding: 0 45px 0 45px;
    height: 50px;
    text-transform: uppercase;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const NavItem = styled.span<InjectableCss>`
    display: inline-flex;

    > span,
    > a {
        margin-left: 10px;
    }
    ${injectCss}
`;

export interface SecondaryNavigationStyles {
    wrapper?: InjectableCss;
    navigationModeMenu?: NavigationModeMenuStyles;
    languageLink?: InjectableCss;
    warehousePickupLink?: InjectableCss;
    signInLink?: InjectableCss;
}

export const secondaryNavigationStyles: SecondaryNavigationStyles = {
    languageLink: {
        css: css`
            flex: 0 0 auto;
            margin-left: 30px;
        `,
    },
    warehousePickupLink: {
        css: css`
            flex: 0 1 auto;
            margin-left: 30px;
            min-width: 0;
        `,
    },
    signInLink: {
        css: css`
            flex: 0 0 auto;
            margin-left: 30px;
        `,
    },
};

const defaultCustomCss = `.wrapper {
}

.navigation-mode-menu {
}

.currency-menu {
}

.language-menu {
}

.ship-to-address-menu {
}

.sign-in-link {
}`;

const SecondaryNavigation: FC<Props> = ({ id, enableWarehousePickup, fields }) => {
    const styles = useMergeStyles("secondaryNavigation", secondaryNavigationStyles);

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <Hidden below="lg">
                <Navigation className="wrapper" {...styles.wrapper}>
                    <NavItem className="navigation-mode-menu">
                        <NavigationModeMenu extendedStyles={styles.navigationModeMenu} />
                    </NavItem>
                    <NavItem className="currency-menu">
                        <Zone zoneName="Currency" contentId={id} fixed />
                    </NavItem>
                    <NavItem className="language-menu" {...styles.languageLink}>
                        <Zone zoneName="Language" contentId={id} fixed />
                    </NavItem>
                    {enableWarehousePickup && (
                        <NavItem className="ship-to-address-menu" {...styles.warehousePickupLink}>
                            <Zone zoneName="ShipToAddress" contentId={id} fixed />
                        </NavItem>
                    )}
                    <NavItem className="sign-in-link" {...styles.signInLink}>
                        <Zone zoneName="SignIn" contentId={id} fixed />
                    </NavItem>
                </Navigation>
            </Hidden>
        </StyledWrapper>
    );
};

const secondaryNavigation: WidgetModule = {
    component: connect(mapStateToProps)(SecondaryNavigation),
    definition: {
        group: "Common",
        icon: "link-simple",
        fieldDefinitions: [
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
                defaultValue: defaultCustomCss,
                isVisible: (item, shouldDisplayAdvancedFeatures) => !!shouldDisplayAdvancedFeatures,
                validate: value => {
                    if (value === undefined || value === null) {
                        return "";
                    }

                    const result = cssLinter.parse(value, { silent: true });
                    if (result?.stylesheet?.parsingErrors) {
                        // the error output at this time only has room for one line so we just show the first error
                        return result.stylesheet.parsingErrors.length <= 0
                            ? ""
                            : result.stylesheet.parsingErrors.map(error => `${error.reason} on line ${error.line}`)[0];
                    }

                    return "Unable to parse Css";
                },
                options: {
                    mode: "css",
                    lint: true,
                    autoRefresh: true,
                },
            },
        ],
    },
};

export default secondaryNavigation;
