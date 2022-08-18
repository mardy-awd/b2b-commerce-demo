/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const updateFile = require("./updateFile");

function doWork(isDevBuild, blueprint) {
    const blueprintRoot = path.resolve(__dirname, `../../modules/${blueprint}/src`);
    const widgetsFolder = searchFolder(blueprintRoot, "Widgets");

    let fileContents = "";
    if (!isDevBuild && blueprint !== "content-library" && widgetsFolder) {
        const relativeWidgetsFolderPath = widgetsFolder.replace(blueprintRoot, `../../${blueprint}/src`);
        fileContents = `/* eslint-disable */
import { addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";

const widgets = require.context("${relativeWidgetsFolderPath}", true, /\.tsx$/);
addWidgetsFromContext(widgets);
`;
    }
    updateFile(path.resolve(__dirname, "../../modules/shell/src/LoadWidgets.ts"), fileContents);
}

function searchFolder(startFolder, folderName) {
    const innderFolders = fs.readdirSync(startFolder, { withFileTypes: true });
    for (let i = 0; i < innderFolders.length; i++) {
        if (!innderFolders[i].isDirectory()) {
            continue;
        }

        const innerFolderName = `${startFolder}/${innderFolders[i].name}`;
        if (innerFolderName.endsWith("Overrides")) {
            continue;
        }

        if (innerFolderName.endsWith(`/${folderName}`)) {
            return innerFolderName;
        }

        const result = searchFolder(innerFolderName, folderName);
        if (result) {
            return result;
        }
    }

    return null;
}

module.exports = doWork;
