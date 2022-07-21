const { lockfileVersion } = require("./package-lock");
const { execSync } = require("child_process");

try {
    console.log("Exec git remote get-url --push origin");
    const origin = execSync("git remote get-url origin").toString().trim();

    if (origin === "https://github.com/InsiteSoftware/insite-commerce.git" && lockfileVersion !== 1) {
        throw new Error(
            `Your npm install bumped the package-lock.json to lockfileVersion ${lockfileVersion}. Revert your changes to package-lock.json. You can run npm install --no-save or revert to npm 6.`,
        );
    }
} catch (err) {
    console.error(err);
}
