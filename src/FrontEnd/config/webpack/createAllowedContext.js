const fs = require("fs");
const appRoot = require("app-root-path");

console.log("Creating AllowContext type in tsx file");

const namedPageContextExportRegex = /export const [a-zA-Z]*PageContext = "[a-zA-Z]*"/;
const contextStrRegex = /"[a-zA-Z]*"/;

const writeNewFile = blueprint => {
    let contents = `// this file is auto generated and should not be modified
export type AllowedContexts =
    | "Layout"
    | "Header"
    | "Footer"`;

    const pages = fs.readdirSync(`${appRoot}/modules/content-library/src/Pages/`);

    for (let i = 0; i < pages.length; i++) {
        const fileContents = fs.readFileSync(`${appRoot}/modules/content-library/src/Pages/${pages[i]}`, "utf-8");

        const pageContext = fileContents.match(namedPageContextExportRegex);

        if (pageContext && pageContext[0]) {
            const strLiteral = pageContext[0].match(contextStrRegex);

            contents += `
    | ${strLiteral}`;
        }
    }
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
