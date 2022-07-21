import React from "react";
import styled from "styled-components";

const TopNavigationBar = () => {
    return (
        <Wrapper>
            <header className="epi-pn-navigation mdc-top-app-bar mdc-top-app-bar--fixed mdc-top-app-bar--dense">
                <div className="epi-pn-navigation-row__primary mdc-top-app-bar__row">
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                        <div className="epi-pn-logo-background"></div>
                        <svg className="epi-uif-logo" aria-hidden="true" role="presentation" viewBox="0 0 148 148">
                            <path d="M49.07 80.66V98.35C62.1536 98.3341 74.6967 93.1297 83.9482 83.8782C93.1997 74.6267 98.4041 62.0836 98.42 49H80.78C80.7668 57.4013 77.42 65.4541 71.4747 71.39C65.5294 77.326 57.4714 80.66 49.07 80.66Z"></path>
                            <path d="M49.07 129.41C40.8327 129.263 32.9824 125.888 27.209 120.01C21.4355 114.133 18.2007 106.224 18.2007 97.9851C18.2007 89.7464 21.4355 81.8371 27.209 75.9598C32.9824 70.0825 40.8327 66.707 49.07 66.5601V49.0101C36.0744 48.9915 23.6037 54.1362 14.4013 63.3123C5.19891 72.4885 0.0186152 84.9445 5.00717e-05 97.9401C-0.0185151 110.936 5.12617 123.406 14.3023 132.609C23.4785 141.811 35.9344 146.991 48.93 147.01H49.07V129.41Z"></path>
                            <path d="M49.07 129.41V146.96C62.0656 146.96 74.529 141.797 83.7182 132.608C92.9075 123.419 98.07 110.956 98.07 97.96H80.5C80.4974 106.297 77.1858 114.292 71.2927 120.188C65.3995 126.085 57.4068 129.402 49.07 129.41Z"></path>
                            <path d="M49.07 31.44V49C62.0656 49 74.529 43.8375 83.7182 34.6482C92.9075 25.459 98.07 12.9956 98.07 0H80.5C80.4947 8.33505 77.182 16.3273 71.2891 22.2221C65.3963 28.1168 57.4051 31.4321 49.07 31.44Z"></path>
                            <path d="M98.37 31.44V49C111.366 49 123.829 43.8375 133.018 34.6482C142.208 25.459 147.37 12.9956 147.37 0H129.78C129.775 8.33159 126.465 16.3209 120.576 22.215C114.688 28.1091 106.702 31.4268 98.37 31.44Z"></path>
                        </svg>
                        <span className="mdc-top-app-bar__title">B2B Commerce</span>
                    </section>
                    <section className="epi-pn-navigation__section--align-center mdc-top-app-bar__section"></section>
                    <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
                        <a
                            role="button"
                            href="https://webhelp.optimizely.com/latest/en/b2b-commerce/b2b-commerce.htm"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="rmwc-icon rmwc-icon--component material-icons mdc-ripple-upgraded--unbounded mdc-ripple-upgraded mdc-top-app-bar__action-item mdc-icon-button"
                            data-mdc-ripple-is-unbounded="true"
                        >
                            <svg
                                data-oui-component="true"
                                className="oui-icon display--inline oui-icon--16"
                                height="16"
                                name="help"
                                stroke="none"
                                fill="white"
                                viewBox="0 0 24 24"
                                width="16"
                            >
                                <desc>Help</desc>
                                <path d="M11.936 24C5.354 24 0 18.626 0 12.021 0 5.393 5.354 0 11.936 0 18.588 0 24 5.383 24 12s-5.412 12-12.064 12zm0-23C5.905 1 1 5.943 1 12.021 1 18.074 5.905 23 11.936 23 18.036 23 23 18.065 23 12S18.036 1 11.936 1z"></path>
                                <path d="M10.458 13.336c0-2.457 3.24-2.698 3.24-4.409 0-.786-.623-1.45-1.912-1.45-1.249 0-2.134.543-2.799 1.409l-1.37-1.51c1.028-1.268 2.577-1.993 4.391-1.993 2.538 0 4.088 1.349 4.088 3.161 0 2.98-3.585 3.222-3.585 5.014 0 .321.163.705.444.905l-1.791.605c-.484-.463-.706-1.068-.706-1.732zm.02 4.47c0-.744.643-1.388 1.409-1.388.764 0 1.409.644 1.409 1.388 0 .765-.646 1.43-1.409 1.43-.766 0-1.409-.665-1.409-1.43z"></path>
                            </svg>
                        </a>
                    </section>
                </div>
            </header>
        </Wrapper>
    );
};

export default TopNavigationBar;

const Wrapper = styled.div`
    .mdc-top-app-bar--fixed {
        transition: box-shadow 0.2s linear;
    }
    .mdc-top-app-bar {
        background-color: #0037ff;
        color: #fff;
        display: flex;
        position: fixed;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        width: 100%;
        z-index: 4;
    }

    .epi-pn-navigation.mdc-top-app-bar .epi-pn-navigation-row__primary {
        background-color: #080736;
    }
    .mdc-top-app-bar--dense .mdc-top-app-bar__row {
        height: 40px;
    }
    .mdc-top-app-bar__row {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 64px;
    }

    .epi-pn-navigation.mdc-top-app-bar .epi-pn-navigation-row__primary .mdc-top-app-bar__section--align-start {
        padding-left: 0;
    }
    .epi-pn-navigation.mdc-top-app-bar .mdc-top-app-bar__section--align-start {
        border-right: 1px solid hsla(0, 0%, 100%, 0.3);
    }
    .epi-pn-navigation.mdc-top-app-bar .mdc-top-app-bar__section--align-end,
    .epi-pn-navigation.mdc-top-app-bar .mdc-top-app-bar__section--align-start {
        flex-grow: 0;
        flex-shrink: 0;
    }
    .mdc-top-app-bar--dense .mdc-top-app-bar__section {
        padding: 0 12px;
    }
    .mdc-top-app-bar__section--align-start {
        justify-content: flex-start;
        order: -1;
    }
    .mdc-top-app-bar__section {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        min-width: 0;
        padding: 8px 12px;
        z-index: 1;
    }

    .epi-pn-navigation .epi-pn-logo-background {
        background-color: #0037ff;
        width: 20px;
        height: 40px;
        position: absolute;
        z-index: -1;
    }

    .epi-pn-navigation .epi-uif-logo {
        border-right: 1px solid hsla(0, 0%, 100%, 0.3);
        box-sizing: border-box;
        fill: currentColor;
        height: 40px;
        width: 51px;
        padding: 5px 10px;
    }

    .epi-pn-navigation svg + .mdc-top-app-bar__title {
        padding-left: 12px;
    }
    .epi-pn-navigation .mdc-top-app-bar__title {
        font-size: 1rem;
        font-weight: 700;
        overflow: visible;
        color: inherit;
        margin: 0;
    }
    .mdc-top-app-bar--dense .mdc-top-app-bar__title {
        padding-left: 4px;
        padding-right: 0;
    }
    .mdc-top-app-bar__title {
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-family: Roboto, sans-serif;
        font-size: 1.25rem;
        line-height: 2rem;
        font-weight: 500;
        letter-spacing: 0.0125em;
        text-decoration: inherit;
        text-transform: inherit;
        padding-left: 20px;
        padding-right: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        z-index: 1;
    }

    .epi-pn-navigation.mdc-top-app-bar .mdc-top-app-bar__section.epi-pn-navigation__section--align-center {
        padding: 0;
    }

    .epi-pn-navigation .mdc-top-app-bar__action-item {
        height: 38px !important;
        width: 38px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none !important;
    }

    .epi-pn-navigation .mdc-icon-button {
        width: 24px;
        height: 24px;
        padding: 0;
        font-size: 24px;
        border-radius: 4px;
    }

    .epi-pn-navigation .mdc-icon-button img,
    .epi-pn-navigation .mdc-icon-button svg {
        width: 24px;
        height: 24px;
    }
`;
