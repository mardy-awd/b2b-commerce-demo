import AdyenCheckout from "@adyen/adyen-web";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { css } from "styled-components";

interface OwnProps {
    redirectResult?: string;
    adyenConfiguration: any;
    adyenErrorMessage?: string;
    setAdyenDropIn: Dispatch<any>;
}

export interface AdyenDropInStyles {
    adyenDropInGridContainer?: GridContainerProps;
    adyenDropInGridItem?: GridItemProps;
    adyenErrorMessageGridItem?: GridItemProps;
    adyenContainer?: InjectableCss;
    adyenPaymentErrorMessage?: InjectableCss;
}

export const adyenDropInStyles: AdyenDropInStyles = {
    adyenDropInGridContainer: {
        gap: 10,
        css: css`
            margin-bottom: 1rem;
        `,
    },
    adyenDropInGridItem: { width: 12 },
    adyenErrorMessageGridItem: { width: 12 },
    adyenContainer: {
        css: css`
            min-width: 100%;
        `,
    },
    adyenPaymentErrorMessage: {
        css: css`
            color: ${getColor("danger")};
            font-weight: 600;
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
};

type Props = OwnProps;
const styles = adyenDropInStyles;

const AdyenDropIn = ({ redirectResult, adyenConfiguration, adyenErrorMessage, setAdyenDropIn }: Props) => {
    const adyenContainerRef = useRef<HTMLDivElement>(null);
    const [adyenDropInObject, setAdyenDropInObject] = useState<any>(null);

    useEffect(() => {
        // need to import this now to ensure that there is a document for this CSS to attach to.
        // eslint-disable-next-line global-require
        require(/* webpackChunkName: "adyenCss" */ "@adyen/adyen-web/dist/adyen.css");
    }, []);

    useEffect(() => {
        if (adyenConfiguration) {
            AdyenCheckout(adyenConfiguration).then(result => {
                if (!adyenContainerRef.current) {
                    return;
                }
                if (redirectResult) {
                    result.submitDetails({ details: { redirectResult } });
                }
                const dropIn = result.create("dropin");
                if (adyenDropInObject) {
                    adyenDropInObject.unmount();
                }
                setAdyenDropIn(dropIn.mount(adyenContainerRef.current));
                setAdyenDropInObject(dropIn);
            });
        }
    }, [redirectResult, adyenConfiguration]);

    useEffect(() => {
        if (adyenErrorMessage && adyenDropInObject) {
            // show error messages but allow user to re-enter payment
            adyenDropInObject.setStatus("ready");
        }
    }, [adyenErrorMessage]);

    return (
        <GridContainer {...styles.adyenDropInGridContainer}>
            <GridItem {...styles.adyenDropInGridItem}>
                <StyledWrapper className="adyen-container" {...styles.adyenContainer}>
                    <div className="adyen-frame" ref={adyenContainerRef} id="adyen-frame"></div>
                </StyledWrapper>
            </GridItem>
            {adyenErrorMessage && (
                <GridItem {...styles.adyenErrorMessageGridItem}>
                    <StyledWrapper {...styles.adyenPaymentErrorMessage} data-test-selector="adyenErrorMessage">
                        {siteMessage(adyenErrorMessage)}
                    </StyledWrapper>
                </GridItem>
            )}
        </GridContainer>
    );
};

// eslint-disable-next-line spire/export-styles
export default AdyenDropIn;
