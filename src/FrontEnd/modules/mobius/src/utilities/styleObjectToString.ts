import "core-js/fn/array/includes"; // needed for IE
import "core-js/fn/object/entries"; // needed for IE
import * as React from "react";

const numericProperties = ["line-height", "font-weight"];

/**
 * Converts a JavaScript Object into a block of CSS rules.
 * @param {object} styleObject CSS rules represented as an Object
 * @returns {string} A block of CSS rules as a String
 */
export default function styleObjectToString(styleObject?: React.CSSProperties) {
    const styleEntries = !styleObject ? [] : Object.entries(styleObject);
    return styleEntries.reduce(
    (styleString, [propName, propValue]) => {
        const name = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
        let value = propValue;
        if (typeof propValue === "number") {
            if (!numericProperties.includes(name)) value = `${propValue}px`;
        } else if (Array.isArray(propValue)) {
            value = propValue.reduce((result, x) => `${result} ${(typeof x === "number") ? `${x}px` : x}`, "");
        }
        return `${styleString}${name}:${value};`;
    },
    "");
}
