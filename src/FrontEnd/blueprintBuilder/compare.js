function compareErrors(currentErrors, previousErrors) {
    const result = {
        newErrors: {},
        errorsWithNewFiles: {},
        fixedErrors: {},
    };

    forKey(currentErrors, (error, locations) => {
        addErrorIfDoesNotExist(previousErrors, result.newErrors, error, locations);
    });

    forKey(previousErrors, (error, locations) => {
        addErrorIfDoesNotExist(currentErrors, result.fixedErrors, error, locations);
    });

    forKey(currentErrors, (error, locations) => {
        const previousLocations = previousErrors[error];
        if (typeof previousLocations !== "undefined") {
            const newLocations = [];
            for (const location of locations) {
                if (previousLocations.indexOf(location) < 0) {
                    newLocations.push(location);
                }
            }

            if (newLocations.length > 0) {
                result.errorsWithNewFiles[error] = newLocations;
            }
        }
    });

    return result;
}

function addErrorIfDoesNotExist(leftErrorSet, rightErrorSet, error, locations) {
    if (typeof leftErrorSet[error] === "undefined") {
        rightErrorSet[error] = locations;
    }
}

function forKey(dictionary, doWork) {
    for (const key in dictionary) {
        doWork(key, dictionary[key]);
    }
}

module.exports = { compareErrors };
