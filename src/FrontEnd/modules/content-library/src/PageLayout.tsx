import PageBreadcrumbs from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { ReactNode } from "react";

interface PageLayoutProps {
    showHeader: boolean;
    header: ReactNode;
    showCompactHeader: boolean;
    compactHeader: ReactNode;
    showBreadcrumbs: boolean;
    pageContent: ReactNode;
    showFooter: boolean;
    footer: ReactNode;
}

// This doesn't currently support HMR
const PageLayout = ({
    showHeader,
    header,
    showBreadcrumbs,
    pageContent,
    showFooter,
    footer,
    showCompactHeader,
    compactHeader,
}: PageLayoutProps) => {
    return (
        <>
            {showHeader && header}
            {showCompactHeader && compactHeader}
            {showBreadcrumbs && (
                <Page as="div">
                    <PageBreadcrumbs />
                </Page>
            )}
            {pageContent}
            {showFooter && footer}
        </>
    );
};

export default PageLayout;
