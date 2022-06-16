/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const updateFile = require("./updateFile");

function doWork(isDevBuild, blueprint) {
    const isWidgetFolder = fs.existsSync(path.resolve(__dirname, `../../modules/${blueprint}/src/Widgets`));
    let fileContents = "";
    if (!isDevBuild && blueprint !== "content-library" && isWidgetFolder) {
        fileContents = `/* eslint-disable */

import { addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";

const widgets = require.context("../../${blueprint}/src/Widgets", true, /\.tsx$/);
addWidgetsFromContext(widgets);
`;
    }
    updateFile(path.resolve(__dirname, "../../modules/shell/src/LoadWidgets.ts"), fileContents);
}

module.exports = doWork;
