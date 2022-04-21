import React, { Fragment } from "react";

export default function getBoldedText(text: string, highlight: string) {
    // Split on highlight term and include term into parts, ignore case
    const regex = new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    if (regex.exec(text)) {
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={`${i}_${part}`}>{regex.exec(part) ? <b>{part}</b> : part}</Fragment>
                ))}
            </span>
        );
    }

    return <>{text}</>;
}
