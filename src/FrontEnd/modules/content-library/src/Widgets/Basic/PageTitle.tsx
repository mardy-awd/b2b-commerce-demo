import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    pageTitle: getCurrentPage(state).fields.title,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const PageTitle: React.FunctionComponent<Props> = ({ pageTitle }: Props) => (
    <Typography variant="h2" as="h1" data-test-selector="PageTitle">
        {pageTitle}
    </Typography>
);

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(PageTitle),
    definition: {
        group: "Basic",
        icon: "PageTitle",
    },
};

export default widgetModule;
