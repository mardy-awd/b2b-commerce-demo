import * as React from "react";
import { IconPresentationProps } from "../Icon/Icon";

const User: React.FC<IconPresentationProps> = props => {
    return (
        <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
        >
            {props.title && <title>{props.title}</title>}
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
};

export default React.memo(User);
