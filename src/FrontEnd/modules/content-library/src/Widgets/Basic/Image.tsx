import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Img, { ImgProps } from "@insite/mobius/Img";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as cssLinter from "css";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    imageUrl = "imageUrl",
    altText = "altText",
    imageLink = "imageLink",
    customCSS = "customCSS",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.imageUrl]: string;
        [fields.altText]: string;
        [fields.imageLink]: LinkFieldValue;
        [fields.customCSS]: string;
    };
}

export interface ImageStyles {
    wrapper?: InjectableCss;
    /**
     * @deprecated Use img instead
     */
    image?: LazyImageProps;
    img?: ImgProps;
    imageLink?: LinkPresentationProps;
}

export const imageStyles: ImageStyles = {
    image: {
        css: css`
            max-width: 100%;
            height: auto;
        `,
    },
    img: {
        css: css`
            max-width: 100%;
            height: auto;
        `,
    },
};

export const Image: FC<OwnProps> = ({ fields }) => {
    const { url } = useGetLink(fields.imageLink);
    const styles = useMergeStyles("image", imageStyles);

    const image = <Img className="img" src={fields.imageUrl} altText={fields.altText} loading="lazy" {...styles.img} />;

    const customCssWrapper = {
        css: css`
            ${fields.customCSS}
        `,
    };

    return (
        <StyledWrapper {...customCssWrapper}>
            <StyledWrapper className="img-wrapper" {...styles.wrapper}>
                {url ? (
                    <Link className="img-link" href={url} {...styles.imageLink}>
                        {image}
                    </Link>
                ) : (
                    image
                )}
            </StyledWrapper>
        </StyledWrapper>
    );
};

const defaultCustomCss = `.img-wrapper {
}

.img-link {
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
    component: Image,
    definition: {
        group: "Basic",
        icon: "image",
        fieldDefinitions: [
            {
                name: fields.imageUrl,
                fieldType: "General",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                tab: basicTab,
            },
            {
                name: fields.altText,
                fieldType: "General",
                editorTemplate: "TextField",
                defaultValue: "",
                tab: basicTab,
            },
            {
                name: fields.imageLink,
                fieldType: "General",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
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
