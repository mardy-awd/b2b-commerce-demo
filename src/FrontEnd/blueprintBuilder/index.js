/* eslint-disable */

const fs = require("fs");
const { promisify } = require("util");
const { exec: _exec, execSync } = require("child_process");

const exec = promisify(_exec);

class Client {
    rootClientPath;
    mainBlueprintsPath = "../modules/blueprints";
    mainBlueprintsShellPath = "../modules/blueprints-shell";
    clientBlueprintsPath;
    clientBlueprintsShellPath;
    blueprints = [];
    clientReport = { name: "", passed: [], failed: [] };
    hasNoBlueprints = false;
    hasBlueprintShell = false;

    constructor({ Name, GitUrl }) {
        this.name = Name;
        this.gitUrl = GitUrl;
        this.clientReport.name = this.name;

        this.rootClientPath = `../../../Clients/${this.name}`;
        if (fs.existsSync(this.rootClientPath)) {
            fs.rmdirSync(this.rootClientPath, { recursive: true });
        }

        const clientModulesPath = `${this.rootClientPath}/src/FrontEnd/modules`;
        this.clientBlueprintsPath = `${clientModulesPath}/blueprints`;
        this.clientBlueprintsShellPath = `${clientModulesPath}/blueprints-shell`;
    }

    do() {
        this.clone();
        this.grabBlueprintNames();
        if (this.hasNoBlueprints) {
            return;
        }
        this.resetAndCopy();
        this.buildBlueprints();
        return this.clientReport;
    }

    clone() {
        console.log(`Shallow cloning sandbox branch from ${this.name}`);
        this.runSync(`git clone --depth 1 --single-branch --branch=sandbox ${this.gitUrl} ${this.rootClientPath}`);
    }

    grabBlueprintNames() {
        console.log(`Grab blueprints ${this.name}`);

        if (fs.existsSync(this.clientBlueprintsPath)) {
            this.blueprints = fs.readdirSync(this.clientBlueprintsPath).filter(str => !str.match(/dockerfile/gi));
            console.log("found blueprints " + this.blueprints);
        } else {
            this.hasNoBlueprints = true;
        }
    }

    resetAndCopy() {
        fs.rmdirSync(this.mainBlueprintsPath, { recursive: true });
        fs.rmdirSync(this.mainBlueprintsShellPath, { recursive: true });

        copyFolderRecursiveSync("../../../blueprints", this.mainBlueprintsPath);
        copyFolderRecursiveSync("../../../blueprints-shell", this.mainBlueprintsShellPath);

        copyFolderRecursiveSync(this.clientBlueprintsPath, this.mainBlueprintsPath);
        copyFolderRecursiveSync(this.clientBlueprintsShellPath, this.mainBlueprintsShellPath);
    }

    buildBlueprints() {
        for (const blueprint of this.blueprints) {
            if (blueprint === "example" || blueprint === "gsd") {
                continue;
            }
            this.runBuildSync(`npm run build ${blueprint}`, blueprint);
        }
    }

    recordBuild(isFail = false, blueprint, errors) {
        if (isFail) {
            this.clientReport.failed.push([blueprint, errors]);
        } else {
            this.clientReport.passed.push(blueprint);
        }
    }

    runSync(cmd) {
        try {
            console.log(`Exec ${this.name} command ${cmd}`);
            execSync(cmd, { stdio: "pipe" });
        } catch (err) {
            console.error(err);
        }
    }

    runBuildSync(cmd, blueprint = "BLUEPRINT_NOT_PROVIDED") {
        try {
            console.log(`Exec ${this.name} command ${cmd}`);
            execSync(cmd, { stdio: "pipe" });
            this.recordBuild(false, blueprint);
        } catch (err) {
            this.recordBuild(true, blueprint, this.combineOutputs(err));
        }
    }

    combineOutputs(err) {
        return err.output.filter(buf => !!buf).join("\n");
    }
}

class Orchestrator {
    reports = [];
    metadata = [];
    isRemoveError = true;
    isRemoveNpmErr = true;

    async start() {
        try {
            if (!fs.existsSync("output")) {
                fs.mkdirSync("output");
            }

            this.moveBaseBlueprints();

            const clientProjects = (await this.getProjects()).map(proj => new Client(proj));

            for (let i = 0; i < clientProjects.length; i++) {
                console.log(`Working on ${clientProjects[i].name}`);
                const proj = clientProjects[i];
                const output = proj.do();
                if (output) {
                    this.reports.push(output);
                }
            }

            fs.writeFileSync("./output/blueprintBuilderOutput.json", JSON.stringify(this.reports), "utf-8");

            this.generateMetadata();
        } catch (err) {
            console.error(err);
        }
    }

    getProjects = async () => {
        try {
            console.log("loading clientProjects.json from disk");
            return require("./clientProjects.json");
        } catch (ex) {
            console.log("failed loading clientProjects.json, trying to generate with beacon");
            const data = await exec("dotnet beacon -- -d");
            return JSON.parse(data.stdout);
        }
    };

    moveBaseBlueprints() {
        copyFolderRecursiveSync("../modules/blueprints", "../../../blueprints");
        copyFolderRecursiveSync("../modules/blueprints-shell", "../../../blueprints-shell");
    }

    generateMetadata() {
        this.parseErrors();

        const initialReport = this.reports.find(entry => entry.failed.length > 0);
        if (this.reports.length === 0) {
            return console.error("Nothing appears to have been built");
        }

        if (!initialReport) {
            return console.log("All builds passed, no failures to construct metadata");
        }

        const initialErrorName = initialReport.name;

        const initialErrorTuple = initialReport.failed[0];
        const [initialErrorBlueprint, initialError] = initialErrorTuple;

        this.metadata.push({
            error: initialError,
            who: [`${initialErrorName} ${initialErrorBlueprint}`],
        });

        for (let i = 0; i < this.reports.length; i++) {
            const currentProjStr = this.reports[i].name;
            const failuresArrOfTuples = this.reports[i].failed;

            failuresArrOfTuples.forEach(([blueprint, errArr]) => {
                let isMatch;
                const newEntry = `${currentProjStr} ${blueprint}`;

                this.metadata.forEach(({ error: metadataErrArr, who: metadataWho }) => {
                    if (isMatch) {
                        return;
                    }

                    isMatch = this.isErrorOutputMatch(metadataErrArr, errArr);
                    if (isMatch) {
                        if (!metadataWho.includes(newEntry)) {
                            metadataWho.push(newEntry);
                        }
                    }
                });

                if (!isMatch) {
                    this.metadata.push({ error: errArr, who: [newEntry] });
                }
            });
        }

        fs.writeFileSync("./output/metadata.json", JSON.stringify(this.metadata), "utf-8");
    }

    isErrorOutputMatch(addedArr, newArr) {
        return addedArr.filter(errStr => newArr.filter(errStr2 => errStr === errStr2).length > 0).length > 0;
    }

    parseErrors() {
        this.reports = this.reports.length > 0 ? this.reports : require("./output/blueprintBuilderOutput.json");
        this.reports = this.reports.map(rprt => ({
            ...rprt,
            failed: rprt.failed.map(([blueprint, errStr]) => [blueprint, this.parseStdOut(errStr, blueprint)]),
        }));
    }

    parseStdOut(errStr, blueprint) {
        const regex = /error(.|\s)*/gi;
        const str = String(errStr);

        const match = str.match(regex);

        let strArr = this.cleanOutput(match ? match[0] : str, blueprint);

        if (this.isRemoveError) {
            strArr = strArr.filter(str => !str.match(/ERROR/gi));
        }

        if (this.isRemoveNpmErr) {
            strArr = strArr.filter(str => !str.match(/npm ERR!.*/gi));
        }

        return strArr;
    }

    cleanOutput(outputStr, blueprint) {
        const regex = new RegExp(blueprint, "gi");
        return outputStr
            .replace(regex, "{BLUEPRINT_NAME}")
            .split("\n")
            .filter(str => str.length > 9)
            .map(str => str.trim());
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

const orchestrator = new Orchestrator();
orchestrator.start();
