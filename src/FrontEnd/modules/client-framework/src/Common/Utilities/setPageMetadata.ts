import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { getUrl, setServerPageMetadata } from "@insite/client-framework/ServerSideRendering";
import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";

export interface PreparedMetadata {
    metaDescription: string;
    metaKeywords: string;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    canonicalUrl?: string;
    alternateLanguageUrls?: SafeDictionary<string>;
    title: string;
    structuredPageData?: string;
}

export interface Metadata {
    metaDescription?: string;
    metaKeywords?: string;
    openGraphImage?: string;
    openGraphTitle?: string;
    openGraphUrl?: string;
    currentPath: string;
    canonicalPath?: string;
    alternateLanguageUrls?: SafeDictionary<string>;
    title?: string;
    websiteName: string;
    structuredPageData?: string;
}

export default function setPageMetadata(
    {
        metaDescription,
        metaKeywords,
        openGraphImage,
        openGraphTitle,
        openGraphUrl,
        currentPath,
        canonicalPath,
        alternateLanguageUrls,
        title,
        websiteName,
        structuredPageData,
    }: Metadata,
    websiteSettings?: WebsiteSettingsModel,
) {
    const url: { protocol: string; host: string } = IS_SERVER_SIDE ? getUrl()! : window.location;
    const authority = `${url.protocol}//${url.host}`;

    const cleanUrl = (url?: string, alternativeUrl = "") => {
        if (!url) {
            return alternativeUrl;
        }

        if (url.toLowerCase().startsWith("http")) {
            return url;
        }

        return `${authority}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const cleanAlternateLanguageUrls = (alternateLanguageUrls?: SafeDictionary<string>) => {
        const languageUrls: { [key: string]: string } = {};
        alternateLanguageUrls &&
            Object.entries(alternateLanguageUrls).forEach(([key, value]) => {
                languageUrls[key] = cleanUrl(value);
            });

        return languageUrls;
    };

    const currentUrl = cleanUrl(currentPath);
    const actualTitle = generatePageTitle(title || "", websiteName, websiteSettings);
    const ogTitle = openGraphTitle || actualTitle || "";
    const ogImage = cleanUrl(openGraphImage);
    const ogUrl = cleanUrl(openGraphUrl, currentUrl);
    const canonicalUrl = cleanUrl(canonicalPath, currentUrl);
    const preparedAlternateLanguageUrls = cleanAlternateLanguageUrls(alternateLanguageUrls);

    if (IS_SERVER_SIDE) {
        setServerPageMetadata({
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            openGraphUrl: ogUrl,
            openGraphTitle: ogTitle,
            openGraphImage: ogImage,
            canonicalUrl,
            alternateLanguageUrls: preparedAlternateLanguageUrls,
            title: actualTitle,
            structuredPageData,
        });
    } else {
        const addOrUpdate = (
            tag: string,
            attributeName: string,
            attributeValue: string,
            defaultAttributes: Dictionary<string>,
            id?: string,
            selector?: string,
        ) => {
            let element = id ? document.getElementById(id) : selector ? document.querySelector(selector) : null;
            if (!element && attributeValue) {
                element = document.createElement(tag);
                for (const key in defaultAttributes) {
                    element.setAttribute(key, defaultAttributes[key]);
                }
                document.head.appendChild(element);
            }

            element?.setAttribute(attributeName, attributeValue);
        };

        document.title = actualTitle;
        addOrUpdate("meta", "content", ogTitle, { id: "ogTitle", property: "og:title" }, "ogTitle", undefined);
        addOrUpdate("meta", "content", ogImage, { id: "ogImage", property: "og:image" }, "ogImage", undefined);
        addOrUpdate("meta", "content", ogUrl, { id: "ogUrl", property: "og:url" }, "ogUrl", undefined);
        addOrUpdate("meta", "content", metaKeywords || "", { name: "keywords" }, undefined, 'meta[name="keywords"]');
        addOrUpdate(
            "meta",
            "content",
            metaDescription || "",
            { name: "description" },
            undefined,
            'meta[name="description"]',
        );
        addOrUpdate("link", "href", canonicalUrl || "", { rel: "canonical" }, undefined, 'link[rel="canonical"]');
        preparedAlternateLanguageUrls &&
            Object.entries(preparedAlternateLanguageUrls)?.forEach(([key, value]) => {
                addOrUpdate(
                    "link",
                    "href",
                    value,
                    { key, rel: "alternate", hrefLang: key },
                    undefined,
                    `link[rel="alternate"][hreflang="${key}"]`,
                );
            });
        let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
        if (jsonLdScript) {
            jsonLdScript.innerHTML = structuredPageData || "";
        } else if (structuredPageData) {
            jsonLdScript = document.createElement("script");
            jsonLdScript.setAttribute("type", "application/ld+json");
            jsonLdScript.innerHTML = structuredPageData;
            document.head.appendChild(jsonLdScript);
        }
    }
}

function generatePageTitle(title: string, websiteName: string, websiteSettings?: WebsiteSettingsModel) {
    if (!websiteSettings) {
        return websiteName + (title ? ` | ${title}` : "");
    }

    if (!websiteSettings.includeSiteNameInPageTitle) {
        return title;
    }

    return websiteSettings.siteNameAfterTitle
        ? `${title}${websiteSettings.pageTitleDelimiter}${websiteName}`
        : `${websiteName}${websiteSettings.pageTitleDelimiter}${title}`;
}
