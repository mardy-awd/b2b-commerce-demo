const { compareErrors } = require("./compare");

test("compareErrors includes new error", () => {
    const result = compareErrors(
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):"],
        },
        {},
    );

    expect(result.newErrors["TS1234: Bad Error"].length).toBe(1);
});

test("compareErrors does not include existing error", () => {
    const result = compareErrors(
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):"],
        },
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):"],
        },
    );

    expect(result.newErrors["TS1234: Bad Error"]).toBe(undefined);
});

test("compareErrors shows new files", () => {
    const result = compareErrors(
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):", "SomeOtherFile.tsx(11,6):"],
        },
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):"],
        },
    );

    expect(result.errorsWithNewFiles["TS1234: Bad Error"].length).toBe(1);
    expect(result.errorsWithNewFiles["TS1234: Bad Error"][0]).toBe("SomeOtherFile.tsx(11,6):");
});
test("compareErrors includes fixed error", () => {
    const result = compareErrors(
        {},
        {
            "TS1234: Bad Error": ["SomeFile.tsx(22,5):"],
        },
    );

    expect(result.fixedErrors["TS1234: Bad Error"].length).toBe(1);
});
