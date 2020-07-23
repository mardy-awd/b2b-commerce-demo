import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getWishListState, getWishListTotal } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedCurrency from "@insite/content-library/Components/LocalizedCurrency";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import WishListSharingStatus, { WishListSharingStatusStyles } from "@insite/content-library/Components/WishListSharingStatus";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const wishListLinesDataView = getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter);

    return ({
        wishList: getWishListState(state, state.pages.myListDetails.wishListId).value,
        wishListTotal: getWishListTotal(wishListLinesDataView),
        language: state.context.session.language,
    });
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface MyListsDetailsHeaderStyles {
    container?: GridContainerProps;
    infoGridItem?: GridItemProps;
    lastUpdateText?: TypographyProps;
    sharingStatus?: WishListSharingStatusStyles;
    shareText?: TypographyProps;
    lineCountText?: TypographyProps;
    totalText?: TypographyProps;
    descriptionGridItem?: GridItemProps;
    descriptionStyles?: SmallHeadingAndTextStyles;
}

const styles: MyListsDetailsHeaderStyles = {
    container: { gap: 15 },
    infoGridItem: {
        width: 12,
        css: css`
            @media print {
                justify-content: flex-start;
                flex-direction: row !important;
            }
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [null, css` flex-direction: column; `, null, null, css` justify-content: flex-start; `], "max")}
        `,
    },
    lastUpdateText: {
        css: css` padding-right: 30px; `,
    },
    sharingStatus: {
        statusText: {
            css: css` padding-right: 30px; `,
        },
    },
    totalText: {
        weight: "bold",
    },
    descriptionGridItem: { width: 6 },
};

export const headerStyles = styles;

const MyListsDetailsHeader: FC<Props> = ({
                                             wishList,
                                             wishListTotal,
                                             language,
                                         }) => {
    if (!wishList) {
        return null;
    }
    const updatedOnDisplay = getLocalizedDateTime({
        dateTime: new Date(wishList.updatedOn),
        language,
        options: {
            year: "numeric", month: "numeric", day: "numeric",
        },
    });
    let lastUpdatedDisplay = `${translate("Updated")} ${updatedOnDisplay}`;
    if (wishList.updatedByDisplayName) {
        lastUpdatedDisplay += ` ${translate("by")} ${wishList.updatedByDisplayName}`;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem  {...styles.infoGridItem}>
                <Typography {...styles.lastUpdateText} data-test-selector="lastUpdate">{lastUpdatedDisplay}</Typography>
                <WishListSharingStatus extendedStyles={styles.sharingStatus}
                                       showNoPermissionsTooltip={true}
                                       wishList={wishList}/>
                {(wishListTotal !== undefined)
                && <Typography {...styles.totalText}>
                    {translate("List Total")}: <LocalizedCurrency amount={wishListTotal}/>
                </Typography>
                }
            </GridItem>
            {wishList.description && <GridItem {...styles.descriptionGridItem}>
                <SmallHeadingAndText
                    heading={translate("Description")}
                    text={wishList.description}
                    extendedStyles={styles.descriptionStyles}
                    data-test-selector="listDescription"
                />
            </GridItem>}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(MyListsDetailsHeader),
    definition: {
        group: "My Lists Details",
        displayName: "Header",
        allowedContexts: [MyListsDetailsPageContext],
    },
};

export default widgetModule;
