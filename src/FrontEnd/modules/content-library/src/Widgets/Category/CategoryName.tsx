/* eslint-disable spire/export-styles */
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import { getIsWebCrawler } from "@insite/client-framework/Components/ContentItemStore";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    currentPage: getCurrentPage(state),
});

type Props = WidgetProps & HasCategoryContext & ReturnType<typeof mapStateToProps>;

const CategoryImage: React.FunctionComponent<Props> = ({ category, currentPage }: Props) => {
    if (!category) {
        return null;
    }

    const isSearchCrawler = getIsWebCrawler();

    return (
        <Typography variant={isSearchCrawler && currentPage.type === "CategoryDetailsPage" ? "h1" : "h2"}>
            {category.name}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withCategory(CategoryImage)),
    definition: {
        group: "Categories",
        icon: "PageTitle",
    },
};

export default widgetModule;
