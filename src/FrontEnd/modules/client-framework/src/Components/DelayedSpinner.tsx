import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import React from "react";
import { css, keyframes } from "styled-components";

const DelayAppearance = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

function DelayedSpinner(props: { isWidget: boolean }) {
    return (
        <StyledWrapper
            css={css`
                opacity: 0;
                animation: ${DelayAppearance} 1s ease-in;
                animation-fill-mode: forwards;
                animation-delay: 1.2s;
            `}
        >
            <LoadingSpinner
                css={css`
                    height: ${props.isWidget ? "400px" : "calc(100vh - 300px)"};
                    margin: 20px auto;
                    display: block;
                `}
            />
        </StyledWrapper>
    );
}

export default DelayedSpinner;
