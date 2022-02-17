import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadSlowMovingCount from "@insite/client-framework/Store/Pages/VmiDashboard/Handlers/LoadSlowMovingCount";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    count: state.pages.vmiDashboard.slowMovingCount,
});

const mapDispatchToProps = {
    loadSlowMovingCount,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiDashboardSlowMovingStyles {
    wrapper?: InjectableCss;
    countText?: TypographyPresentationProps;
    titleText?: TypographyPresentationProps;
}

export const headerStyles: VmiDashboardSlowMovingStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            width: 230px;
            height: 230px;
            border: 1px solid ${getColor("common.border")};
            float: left;
            margin-right: 15px;
            margin-bottom: 15px;
            font-weight: bold;
        `,
    },
    countText: {
        css: css`
            font-size: 65px;
        `,
    },
    titleText: {
        css: css`
            font-size: 20px;
        `,
    },
};

const styles = headerStyles;

const VmiDashboardSlowMoving = ({ count, loadSlowMovingCount }: Props) => {
    useEffect(() => {
        loadSlowMovingCount();
    }, []);

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.countText} as="h3">
                {count}
            </Typography>
            <Typography {...styles.titleText} as="h3">
                {translate("Slow Moving")}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiDashboardSlowMoving),
    definition: {
        displayName: "Slow Moving",
        group: "VMI Dashboard",
        allowedContexts: ["VmiDashboardPage"],
    },
};

export default widgetModule;
