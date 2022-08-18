/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const appRoot = require("app-root-path");

const writeNewFile = blueprint => {
    console.log("Creating AllowContext type in tsx file");

    let contents = `// this file is auto generated and should not be modified
export type AllowedContexts =`;

    const pages = fs.readdirSync(`${appRoot}/modules/content-library/src/Pages/`);
    pages.forEach(page => {
        if (page === "Page.tsx") {
            return;
        }

        const strLiteral = page.replace(".tsx", "");
        contents += `
    | "${strLiteral}"`;
    });

    if (blueprint !== "content-library") {
        contents += `
    | string`;
    }

    contents += `;
`;

    const path = `${appRoot}/modules/client-framework/src/Types/AllowedContexts.ts`;

    const existingContents = fs.existsSync(path) && fs.readFileSync(path).toString();
    if (contents !== existingContents) {
        fs.writeFileSync(path, contents, "utf-8");
        console.log("Writing AllowContexts.tsx file");
    }
};

module.exports = writeNewFile;
