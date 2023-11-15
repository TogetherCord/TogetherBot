const 
    Discord = require("discord.js"),
    intents = new Discord.IntentsBitField(3276799),
    bot = new Discord.Client({intents}),
    config = require("./config"),
    loadCommands = require("./Loaders/loadCommands"),
    loadEvents = require("./Loaders/loadEvents")

bot.commands = new Discord.Collection()
bot.color = "#0111FF";
bot.function = {
    createId: require("./Fonctions/createId")
}

bot.login(config.token)
loadCommands(bot)
loadEvents(bot)