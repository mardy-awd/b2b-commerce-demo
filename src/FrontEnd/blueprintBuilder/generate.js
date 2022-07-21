function generateFromFile(filePath) {
    const reports = require(filePath);

    return generateFromBuildOutputs(reports);
}

function generateFromBuildOutputs(buildOutputs) {
    if (buildOutputs.length === 0) {
        console.error("Nothing appears to have been built");
        return [];
    }

    const parsedBuildOutputs = [];
    for (const build of buildOutputs) {
        const failed = [];
        for (const blueprintName in build.failed) {
            failed.push({
                blueprintName,
                parsedErrors: parseErrorsFromOutput(build.failed[blueprintName]),
            })
        }
        if (failed.length > 0) {
            parsedBuildOutputs.push({ name: build.name, failed });
        }
    }

    const metadata = {};

    for (const buildOutput of parsedBuildOutputs) {
        const clientName = buildOutput.name;

        for (const { blueprintName, parsedErrors } of buildOutput.failed) {
            for (const error of parsedErrors) {
                if (!metadata[error.message]) {
                    metadata[error.message] = [];
                }
                metadata[error.message].push(clientName + " " + blueprintName + " " + error.location);
            }
        }
    }

    const sortedMetadata = {};
    for (const key of Object.keys(metadata).sort())
    {
        sortedMetadata[key] = metadata[key]
    }

    return sortedMetadata;
}

function parseErrorsFromOutput(outputFromBuild) {
    const lines = outputFromBuild.split("\n");
    const errors = [];
    let foundError = false;
    for (let x = 0; x < lines.length; x++) {
        let errorLocation = "";
        while (lines[x].trim().startsWith("ERROR in ")) {
            errorLocation = lines[x];
            x++;
            foundError = true;
        }

        if (foundError) {
            let nextError = "";
            while (lines[x] !== "") {
                nextError += lines[x] + "\n";
                x++;
            }

            const indexOf = nextError.indexOf("\u001b");
            if (indexOf > 0) {
                nextError = nextError.substring(0, indexOf);
            }

            errors[errors.length] = {
                message: nextError.trimEnd(),
                location: errorLocation,
            };
            foundError = false;
        }
    }

    return errors;
}

module.exports = { parseErrorsFromOutput, generateFromBuildOutputs, generateFromFile };
