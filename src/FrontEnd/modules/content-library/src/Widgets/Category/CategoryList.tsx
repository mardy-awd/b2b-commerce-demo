import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getCategoriesDataView,
    getCategoryState,
    getSubCategoryIds,
} from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import loadCategories from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategories";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps, GridWidths } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css, ThemeProps, withTheme } from "styled-components";

const enum fields {
    showImages = "showImages",
    showOnlyTopLevelCategories = "showOnlyTopLevelCategories",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showImages]: boolean;
        [fields.showOnlyTopLevelCategories]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const getCategoriesParameter = {
        maxDepth: props.fields.showOnlyTopLevelCategories ? 1 : 2,
        includeStartCategory: false,
    };
    return {
        categoriesDataView: getCategoriesDataView(state, getCategoriesParameter),
        getCategoriesParameter,
        topLevelCategoryIds: getSubCategoryIds(state, emptyGuid),
    };
};

const mapDispatchToProps = {
    loadCategories,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    ThemeProps<BaseTheme>;

export interface CategoryListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    container?: GridContainerProps;
    categoryItem?: GridItemProps;
    innerContainer?: GridContainerProps;
    categoryImageItem?: GridItemProps;
    categoryImageLink?: LinkPresentationProps;
    categoryImage?: LazyImageProps;
    categoryNameLinkItem?: GridItemProps;
    categoryNameLink?: LinkPresentationProps;
    categoryName?: TypographyProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
    viewMoreLinkItem?: GridItemProps;
    viewMoreLink?: LinkPresentationProps;
}

export const categoryListStyles: CategoryListStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    container: {
        gap: 20,
    },
    categoryItem: {
        // width is dynamic here
        width: 0,
    },
    innerContainer: {
        gap: 10,
    },
    categoryImageItem: {
        width: 12,
        css: css`
            height: 160px;
        `,
    },
    categoryImage: {
        width: "160px",
        height: "160px",
    },
    categoryNameLinkItem: {
        width: 12,
        css: css`
            padding-bottom: 8px;
        `,
    },
    categoryName: {
        css: css`
            color: #363636;
            font-weight: bold;
        `,
    },
    subCategoryNameLinkItem: {
        width: 12,
    },
    viewMoreLinkItem: {
        width: 12,
        css: css`
            font-weight: bold;
            padding-top: 10px;
        `,
    },
};

const styles = categoryListStyles;

class CategoryList extends React.Component<Props> {
    container = React.createRef<HTMLDivElement>();
    categoryItemStyles: GridItemProps = { ...styles.categoryItem };

    UNSAFE_componentWillMount(): void {
        const { categoriesDataView, getCategoriesParameter, loadCategories } = this.props;
        if (!categoriesDataView.isLoading && !categoriesDataView.value) {
            loadCategories(getCategoriesParameter);
        }
    }

    recalculateWidth = () => {
        if (!this.container.current) {
            return;
        }

        const { breakpoints } = this.props.theme;
        const { clientWidth } = this.container.current;
        let width: GridWidths;
        if (clientWidth < breakpoints.values[1]) {
            width = 12;
        } else if (clientWidth < breakpoints.values[2]) {
            width = 6;
        } else if (clientWidth < breakpoints.values[3]) {
            width = 4;
        } else {
            width = 2;
        }

        if (width === this.categoryItemStyles.width) {
            return;
        }

        this.categoryItemStyles.width = width;
        this.forceUpdate();
    };

    componentDidMount() {
        this.recalculateWidth();
        window.addEventListener("resize", this.recalculateWidth, true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.recalculateWidth);
    }

    componentDidUpdate(prevProps: Props) {
        if (!prevProps.categoriesDataView.value && this.props.categoriesDataView.value) {
            this.recalculateWidth();
        }
    }

    render() {
        const {
            categoriesDataView,
            topLevelCategoryIds,
            fields: { showImages, showOnlyTopLevelCategories },
        } = this.props;
        if (categoriesDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!categoriesDataView.value || !topLevelCategoryIds) {
            return null;
        }

        const categories = categoriesDataView.value.filter(o => topLevelCategoryIds.indexOf(o.id) > -1);

        return (
            <StyledWrapper ref={this.container}>
                <GridContainer {...styles.container}>
                    {categories.map(category => (
                        <GridItem key={category.id.toString()} {...this.categoryItemStyles}>
                            <GridContainer {...styles.innerContainer}>
                                {showImages && (
                                    <GridItem {...styles.categoryImageItem}>
                                        {category.path && (
                                            <Link href={category.path} {...styles.categoryImageLink}>
                                                <LazyImage
                                                    src={category.smallImagePath}
                                                    {...styles.categoryImage}
                                                    altText={category.imageAltText}
                                                />
                                            </Link>
                                        )}
                                    </GridItem>
                                )}
                                <GridItem {...styles.categoryNameLinkItem}>
                                    <Link href={category.path} {...styles.categoryNameLink}>
                                        <Typography {...styles.categoryName}>{category.shortDescription}</Typography>
                                    </Link>
                                </GridItem>
                                {!showOnlyTopLevelCategories && (
                                    <>
                                        {category.subCategoryIds &&
                                            category.subCategoryIds.slice(0, 4).map(subCategoryId => (
                                                <GridItem key={subCategoryId} {...styles.subCategoryNameLinkItem}>
                                                    <SubCategoryLink categoryId={subCategoryId} />
                                                </GridItem>
                                            ))}
                                        {category.subCategoryIds && category.subCategoryIds.length > 4 && (
                                            <GridItem {...styles.viewMoreLinkItem}>
                                                <Link href={category.path} {...styles.viewMoreLink}>
                                                    {translate("View More")}
                                                </Link>
                                            </GridItem>
                                        )}
                                    </>
                                )}
                            </GridContainer>
                        </GridItem>
                    ))}
                </GridContainer>
            </StyledWrapper>
        );
    }
}

const SubCategoryLinkView = ({ category }: ReturnType<typeof linkMapStateToProps>) => {
    if (!category) {
        return null;
    }

    return (
        <Link href={category.path} {...styles.subCategoryNameLink}>
            {category.shortDescription}
        </Link>
    );
};

const linkMapStateToProps = (state: ApplicationState, ownProps: { categoryId: string }) => ({
    category: getCategoryState(state, ownProps.categoryId).value,
});

const SubCategoryLink = connect(linkMapStateToProps)(SubCategoryLinkView);

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withTheme(CategoryList)),
    definition: {
        group: "Categories",
        icon: "list-ul",
        allowedContexts: ["CategoryListPage", "HomePage"],
        fieldDefinitions: [
            {
                name: fields.showImages,
                displayName: "Show Images",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showOnlyTopLevelCategories,
                displayName: "Show only top-level categories",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 2,
            },
        ],
    },
};

export default widgetModule;
