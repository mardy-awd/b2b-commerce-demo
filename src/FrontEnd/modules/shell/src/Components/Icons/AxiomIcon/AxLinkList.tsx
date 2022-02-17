import shellTheme from "@insite/shell/ShellTheme";
import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
    display: inline;
    position: relative;
    height: 25px;
    width: 25px;

    i {
        position: absolute;
        color: ${shellTheme.colors.text.main};
        font-size: 20px;

        &.fa-list-ul {
            top: 0;
            left: 0;
            z-index: 10;
        }

        &.fa-link {
            bottom: 4px;
            right: -1px;
            font-size: 12px;
            z-index: 100;
            background: #fff;
            transform: rotate(-6deg);
            border-radius: 50%;
            padding-left: 1px;
        }
    }
`;

const AxLinkList = (props: any) => (
    <IconContainer>
        <i className="fa-light fa-list-ul"></i>
        <i className="fa-light fa-link"></i>
    </IconContainer>
);

export default AxLinkList;
