/* eslint-disable */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateFromFile } = require("./generate");

function buildBlueprints(numberToBuild) {
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
            console.log(`Working on ${clientProjects[i].Name}`);
            const output = buildBlueprint(clientProjects[i].Name, clientProjects[i].GitUrl)
            if (output) {
                reports.push(output);
            }
        }

        fs.writeFileSync("./output/blueprintBuilderOutput.json", JSON.stringify(reports), "utf-8");
    } catch (err) {
        console.error(err);
    }
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

    console.log("Cleaning build location and copying blueprints")
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

    for (const blueprint of blueprints) {
        if (blueprint === "example" || blueprint === "gsd") {
            continue;
        }
        const cmd = `npm run build ${blueprint}`;

        try {
            console.log(`Exec ${name} command ${cmd}`);
            execSync(cmd, { stdio: "pipe", cwd: path.join(__dirname, "..") });
            passed.push(blueprint);
        } catch (error) {
            failed[blueprint] = error.output.filter(o => !!o).join("\n");
        }
    }

    return { name, passed, failed };
}

function generateMetadata() {
    const metadata = generateFromFile("./output/blueprintBuilderOutput.json");

    fs.writeFileSync("./output/metadata.json", JSON.stringify(metadata, null, "  "), "utf-8");
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

if (type !== "generate") {
    buildBlueprints(numberToBuild);
}

generateMetadata()
