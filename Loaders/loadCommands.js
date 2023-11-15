const fs = require("fs");
const path = require("path");

module.exports = async bot => {
    const commandFiles = getAllCommandFiles("./Commands");

    for (const file of commandFiles) {
        const command = require(file);
        if (!command.name || typeof command.name !== "string") {
            throw new TypeError(`La commande ${path.basename(file, ".js")} n'a pas de nom !`);
        }
        bot.commands.set(command.name, command);
    }
};

function getAllCommandFiles(directory) {
    const commandFiles = [];

    function readDirectory(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const isDirectory = fs.statSync(filePath).isDirectory();

            if (isDirectory) {
                readDirectory(filePath);
            } else if (file.endsWith(".js")) {
                commandFiles.push(path.resolve(filePath));
            }
        });
    }

    readDirectory(directory);
    return commandFiles;
}

