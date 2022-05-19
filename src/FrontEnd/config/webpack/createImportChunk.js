const fs = require("fs");
const appRoot = require("app-root-path");
const glob = require("glob");

let contents;
const widgetExtensionsObj = {};

const skippedWidgetDirectories = ["Common", "Basic", "Header", "Footer", "SignIn"];
const skippedPages = [
    "HomePage.tsx",
    "Header.tsx",
    "Footer.tsx",
    "SignInPage.tsx",
    "Layout.tsx",
    "UnhandledErrorModal.tsx",
    "SharedContent.tsx",
    "VariantRootPage.tsx",
];

function isSkippedPage(page) {
    for (let i = 0; i < skippedPages.length; i++) {
        if (page.match(skippedPages[i])) {
            return true;
        }
    }
    return false;
}

const writeNewFile = blueprint => {
    console.log("Creating import chunk file");
    contents = `const importChunkObj: any = {\n`;

    loadBlueprintExtensions(blueprint);
    addWidgetImports();
    addBlueprintWidgetImports(blueprint);
    addPageImports();
    addRemainingExtensionsImports();
    completeObjAndExport();

    fs.writeFileSync(`${appRoot}/modules/client-framework/src/Components/importChunk.tsx`, contents, "utf-8");
    console.log("Writing import chunk file");
};

const loadBlueprintExtensions = blueprint => {
    if (!blueprint || blueprint === "content-library") {
        return;
    }

    const blueprintName = blueprint.split("/")[1];
    console.log(`Loading blueprint widget extensions`);

    const blueprintRoot = `${appRoot}/modules/blueprints/${blueprintName}/src`.replace(/\\/g, "/");
    const widgetExtensionsFolder = searchFolder(blueprintRoot, "WidgetExtensions");
    if (!widgetExtensionsFolder) {
        console.log("Blueprint widget extensions folder is not found");
        return;
    }

    const shortWidgetExtensionsFolderPath = widgetExtensionsFolder.replace(blueprintRoot, `@${blueprintName}`);
    const extensionFiles = glob.sync(`${widgetExtensionsFolder}/**/*.ts`);
    extensionFiles.forEach(f => {
        const shortPath = f.replace(widgetExtensionsFolder, shortWidgetExtensionsFolderPath).replace(".ts", "");
        const fileName = f.split("/").pop().replace(".ts", "");
        widgetExtensionsObj[fileName] = shortPath;
    });
};

const addWidgetImports = () => {
    console.log("Adding widgets");
    const directories = fs.readdirSync(`${appRoot}/modules/content-library/src/Widgets/`);

    for (let i = 0; i < directories.length; i++) {
        const dir = directories[i];

        if (skippedWidgetDirectories.includes(dir)) {
            continue;
        }

        const files = fs.readdirSync(`${appRoot}/modules/content-library/src/Widgets/${dir}`);
        for (let j = 0; j < files.length; j++) {
            const file = files[j].replace(".tsx", "").replace(".ts", "");
            const chunkName = consolidateChunks(dir.toLowerCase());
            const extensionImportString = getExtensionImport(file, dir, chunkName);
            const importString = `	"${dir}/${file}": () => {${extensionImportString}
        return import(
            /* webpackChunkName: "${chunkName}Chunk" */ "@insite/content-library/Widgets/${dir}/${file}"
        );
	},\n`;
            addFileContents(importString);
        }
    }
};

const addBlueprintWidgetImports = blueprint => {
    if (!blueprint || blueprint === "content-library") {
        return;
    }

    const blueprintName = blueprint.split("/")[1];
    console.log(`Adding blueprint widgets`);

    const widgetsFolder = searchFolder(`${appRoot}/modules/blueprints/${blueprintName}/src`, "Widgets");
    if (!widgetsFolder) {
        console.log("Blueprint widgets folder is not found");
        return;
    }

    const shortWidgetsFolderPath = widgetsFolder.replace(
        `${appRoot}/modules/blueprints/${blueprintName}/src/`,
        `@${blueprintName}/`,
    );
    const directories = fs.readdirSync(widgetsFolder, { withFileTypes: true });
    for (let i = 0; i < directories.length; i++) {
        if (!directories[i].isDirectory()) {
            continue;
        }

        const dir = directories[i].name;
        if (skippedWidgetDirectories.includes(dir)) {
            continue;
        }

        const files = fs.readdirSync(`${widgetsFolder}/${dir}`);
        for (let j = 0; j < files.length; j++) {
            if (!files[j].endsWith(".tsx")) {
                continue;
            }
            const file = files[j].replace(".tsx", "");
            const chunkName = consolidateChunks(dir.toLowerCase());
            const extensionImportString = getExtensionImport(file, dir, chunkName);
            const importString = `	"${dir}/${file}": () => {${extensionImportString}
        return import(
            /* webpackChunkName: "${chunkName}Chunk" */ "${shortWidgetsFolderPath}/${dir}/${file}"
        );
	},\n`;
            addFileContents(importString);
        }
    }
};

const addPageImports = () => {
    console.log("Adding pages");
    const pages = fs.readdirSync(`${appRoot}/modules/content-library/src/Pages/`);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const chunkName = consolidateChunks(page.toLowerCase().replace("page.tsx", ""));
        const fileName = page.replace(".tsx", "");

        if (isSkippedPage(page)) {
            continue;
        }

        const importString = `    ${fileName}: () => {
            return import(
                /* webpackChunkName: "${chunkName}Chunk" */ "@insite/content-library/Pages/${fileName}"
            );
        },\n`;
        addFileContents(importString);
    }
};

const addRemainingExtensionsImports = () => {
    const imports = Object.values(widgetExtensionsObj)
        .map(f => `require("${f}");`)
        .join("\n");
    contents = `${imports}\n\n${contents}`;
};

const completeObjAndExport = () => {
    addFileContents(`        
    }
	export default importChunkObj
`);
};

const consolidationMap = {
    brands: /brand/,
    news: /news/,
    products: /product/,
    carts: /cart/,
    orderapproval: /orderapproval/,
    orderconfirmation: /orderconfirmation/,
    orderdetails: /orderdetails/,
    orderstatus: /orderstatus/,
    orderupload: /orderupload/,
    orders: /order/,
    checkouts: /checkout/,
    changes: /change/,
    categories: /(category|categories)/,
    budgets: /budget/,
    rfqs: /rfq/,
    vmis: /vmi/,
    invoices: /invoice/,
    mylists: /mylist/,
    requisitions: /requisition/,
    users: /user/,
};

const consolidateChunks = chunkName => {
    for (const key in consolidationMap) {
        if (chunkName.match(consolidationMap[key])) {
            return key;
        }
    }
    if (chunkName.length === 0) {
        return "page";
    }
    return chunkName;
};

const addFileContents = addition => {
    contents += addition;
};

const searchFolder = (startFolder, folderName) => {
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
};

const getExtensionImport = (file, dir, chunkName) => {
    let extensionPath = widgetExtensionsObj[`${file}Extension`];
    if (extensionPath) {
        delete widgetExtensionsObj[`${file}Extension`];
    } else {
        extensionPath = widgetExtensionsObj[`${file}Extensions`];
        if (extensionPath) {
            delete widgetExtensionsObj[`${file}Extensions`];
        } else {
            extensionPath = widgetExtensionsObj[`${dir}Extension`];
            if (extensionPath) {
                delete widgetExtensionsObj[`${dir}Extension`];
            } else {
                extensionPath = widgetExtensionsObj[`${dir}Extensions`];
                if (extensionPath) {
                    delete widgetExtensionsObj[`${dir}Extensions`];
                }
            }
        }
    }

    return extensionPath ? `\n        import(/* webpackChunkName: "${chunkName}Chunk" */ "${extensionPath}");` : "";
};

module.exports = writeNewFile;
