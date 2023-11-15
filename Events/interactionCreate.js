const Discord = require('discord.js');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
module.exports = async (bot, interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused();
        if (interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({ name: cmd.name, value: cmd.name })) : choices.map(choice => ({ name: choice.name, value: choice.name })));
        }

        if (interaction.commandName === "setstatus") {
            let choices = ["Listening", "Watching", "Playing", "Streaming", "Competing"];
            let sortie = choices.filter(c => c.includes(entry));
            await interaction.respond(entry === "" ? sortie.map(c => ({ name: c, value: c })) : sortie.map(c => ({ name: c, value: c })));
        }
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const commandName = interaction.commandName;
        const commandFile = findCommandFile(commandName, path.join(__dirname, '../Commands'));

        if (commandFile) {
            try {
                const command = require(commandFile);
                command.run(bot, interaction, interaction.options, bot.db);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error(`Command file not found for '${commandName}'`);
        }
    }
};

function findCommandFile(commandName, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        if (isDirectory) {
            const subDirectory = path.join(directory, file);
            const subCommandFile = findCommandFile(commandName, subDirectory);
            if (subCommandFile) {
                return subCommandFile;
            }
        } else {
            const fileName = path.parse(file).name;
            if (fileName === commandName) {
                return filePath;
            }
        }
    }

    return null;
}