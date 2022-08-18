import { useEagerLogoLoading } from "@insite/client-framework/Common/EagerLoadingLogo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Img, { ImgProps } from "@insite/mobius/Img";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    homePageLink: getHomePageUrl(state),
});

const enum fields {
    logoImage = "logoImage",
    isMobileSpecific = "isMobileSpecific",
    mobileSpecificImage = "mobileSpecificImage",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.logoImage]: string;
        [fields.isMobileSpecific]: boolean;
        [fields.mobileSpecificImage]: string;
        [fields.customCSS]: string;
    };
    extendedStyles?: LogoStyles;
    externalCustomCSS?: string;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface LogoStyles {
    wrapper?: InjectableCss;
    /**
     * @deprecated Use img instead
     */
    image?: LazyImageProps;
    img?: ImgProps;
}

export const logoStyles: LogoStyles = {
    wrapper: {
        css: css`
            max-width: 110px;
            max-height: 110px;
        `,
    },
    image: {
        css: css`
            width: 100%;
        `,
    },
    img: {
        css: css`
            width: 100%;
        `,
    },
};

export const Logo: React.FunctionComponent<Props> = ({
    fields,
    extendedStyles,
    homePageLink,
    externalCustomCSS,
}: Props) => {
    const styles = useMergeStyles("logo", logoStyles, extendedStyles);
    const isEager = useEagerLogoLoading();

    const customCssWrapper = {
        css: css`
            ${externalCustomCSS || fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <StyledWrapper {...styles.wrapper} className="wrapper">
                <Link href={homePageLink} className="home-page-link">
                    <Img
                        src={fields.logoImage}
                        loading={isEager ? "eager" : "lazy"}
                        altText={translate("Home")}
                        {...styles.img}
                        className="img"
                    />
                </Link>
            </StyledWrapper>
        </StyledWrapper>
    );
};

const defaultCustomCss = `.wrapper {
}

.home-page-link {
}

.img {
}
`;

const basicTab = {
    displayName: "Basic",
    sortOrder: 0,
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(Logo),
    definition: {
        group: "Basic",
        icon: "diamond",
        fieldDefinitions: [
            {
                name: fields.logoImage,
                displayName: "Logo Image",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
                tab: basicTab,
            },
            {
                name: fields.isMobileSpecific,
                displayName: "Mobile Specific Image",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                isRequired: true,
                variant: "toggle",
                tab: basicTab,
            },
            {
                name: fields.mobileSpecificImage,
                displayName: "Mobile Logo",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
                isVisible: widget => widget.fields.isMobileSpecific,
                tab: basicTab,
            },
            {
                name: fields.customCSS,
                displayName: "Custom CSS",
                editorTemplate: "CodeField",
                fieldType: "General",
                tab: advancedTab,
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

export default widgetModule;
