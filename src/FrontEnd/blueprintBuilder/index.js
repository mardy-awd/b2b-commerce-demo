/* eslint-disable */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateFromFile } = require("./generate");
const { compareErrors } = require("./compare");

function buildBlueprints(numberToBuild) {
    console.log(`##teamcity[blockOpened name='Build Blueprints'`);
    try {
        if (!fs.existsSync("output")) {
            fs.mkdirSync("output");
        }

        copyFolderRecursiveSync("../modules/blueprints", "../../../blueprints");
        copyFolderRecursiveSync("../modules/blueprints-shell", "../../../blueprints-shell");

        const clientProjects = getProjects();

        const reports = [];

        if (!numberToBuild) {
            numberToBuild = clientProjects.length;
        }

        for (let i = 0; i < numberToBuild; i++) {
            console.log(`##teamcity[blockOpened name='${clientProjects[i].Name}'`);
            console.log(`Working on ${clientProjects[i].Name}`);
            const output = buildBlueprint(clientProjects[i].Name, clientProjects[i].GitUrl);
            if (output) {
                reports.push(output);
            }
            console.log(`##teamcity[blockClosed name='${clientProjects[i].Name}'`);
        }

        fs.writeFileSync("./output/blueprintBuilderOutput.json", JSON.stringify(reports), "utf-8");
    } catch (err) {
        console.error(err);
    }
    console.log(`##teamcity[blockClosed name='Build Blueprints'`);
}

function getProjects() {
    try {
        console.log("loading clientProjects.json from disk");
        return require("./clientProjects.json");
    } catch (ex) {
        console.log("failed loading clientProjects.json, trying to generate with beacon");
        const data = execSync("dotnet beacon -- -d").toString();
        return JSON.parse(data);
    }
}

function buildBlueprint(name, gitUrl) {
    const passed = [];
    const failed = {};

    const rootClientPath = `../../../Clients/${name}`;
    if (fs.existsSync(rootClientPath)) {
        fs.rmdirSync(rootClientPath, { recursive: true });
    }

    console.log(`Shallow cloning sandbox branch from ${name}`);
    const command = `git clone --depth 1 --single-branch --branch=sandbox ${gitUrl} ${rootClientPath}`;
    try {
        execSync(command, { stdio: "pipe" });
    } catch (err) {
        console.error(err);
    }

    const clientModulesPath = `${rootClientPath}/src/FrontEnd/modules`;
    const clientBlueprintsPath = `${clientModulesPath}/blueprints`;
    const clientBlueprintsShellPath = `${clientModulesPath}/blueprints-shell`;

    const mainBlueprintsPath = "../modules/blueprints";
    const mainBlueprintsShellPath = "../modules/blueprints-shell";

    console.log("Cleaning build location and copying blueprints");
    fs.rmdirSync(mainBlueprintsPath, { recursive: true });
    fs.rmdirSync(mainBlueprintsShellPath, { recursive: true });

    copyFolderRecursiveSync("../../../blueprints", mainBlueprintsPath);
    copyFolderRecursiveSync("../../../blueprints-shell", mainBlueprintsShellPath);

    copyFolderRecursiveSync(clientBlueprintsPath, mainBlueprintsPath);
    copyFolderRecursiveSync(clientBlueprintsShellPath, mainBlueprintsShellPath);

    console.log(`Grab blueprints ${name}`);
    if (!fs.existsSync(clientBlueprintsPath)) {
        return;
    }
    const blueprints = fs.readdirSync(clientBlueprintsPath).filter(str => !str.match(/dockerfile/gi));
    console.log("found blueprints " + blueprints);

    let fastBuild = "0";

    for (const blueprint of blueprints) {
        if (blueprint === "example" || blueprint === "gsd") {
            continue;
        }
        console.log(`##teamcity[blockOpened name='${blueprint}'`);
        const cmd = `npm run build ${blueprint}`;

        try {
            console.log(`Exec ${name} command ${cmd}`);
            execSync(cmd, { env: { FAST_BUILD: fastBuild }, stdio: "pipe", cwd: path.join(__dirname, "..") });
            passed.push(blueprint);
        } catch (error) {
            failed[blueprint] = error.output.filter(o => !!o).join("\n");
        }

        fastBuild = "1";
        console.log(`##teamcity[blockClosed name='${blueprint}'`);
    }

    return { name, passed, failed };
}

function generateErrors() {
    const errors = generateFromFile("./output/blueprintBuilderOutput.json");

    fs.writeFileSync("./output/errors.json", JSON.stringify(errors, null, "  "), "utf-8");
}

function generateComparison() {
    const errors = require("./output/errors.json");
    if (!fs.existsSync("./previous")) {
        return;
    }
    const files = fs.readdirSync("./previous");
    for (const file of files) {
        const previousErrors = require("./previous/" + file);
        const newErrors = compareErrors(errors, previousErrors);
        fs.writeFileSync("./output/comparedTo-" + file, JSON.stringify(newErrors, null, "  "), "utf-8");
    }
}

function copyFolderRecursiveSync(source, destination) {
    if (!fs.existsSync(source)) {
        return;
    }

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);
        files.forEach(file => {
            const nextSource = `./${source}/${file}`;
            const nextDestination = `./${destination}/${file}`;
            if (fs.lstatSync(nextSource).isDirectory()) {
                copyFolderRecursiveSync(nextSource, nextDestination);
            } else {
                fs.copyFileSync(nextSource, nextDestination);
            }
        });
    }
}

const argument = process.argv[2];
let numberToBuild = parseInt(argument) || undefined;
let type = undefined;
if (!numberToBuild) {
    type = argument;
}

if (process.env.NUMBER_TO_BUILD) {
    numberToBuild = process.env.NUMBER_TO_BUILD;
}

if (type === "generate") {
    generateErrors();
} else if (type === "compare") {
    generateComparison();
} else {
    buildBlueprints(numberToBuild);
    generateErrors();
    generateComparison();
}
