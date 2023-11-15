const 
    Discord = require("discord.js"),
    loadSlashCommands = require("../Loaders/loadSlashcommands"),
    loadDatabase = require("../Loaders/loadDatabase"),
    gradient = require('gradient-string'),
    { ActivityType } = require('discord.js')

module.exports = async bot => {

    bot.user.setPresence({ status: 'dnd', })

    bot.db = await loadDatabase()
    bot.db.connect(function () {
        console.log("Connected to database")
    })

    await loadSlashCommands(bot)

    setInterval(function () {
        bot.db.query('SELECT 1');
    }, 5000);
    
    console.clear()

    console.log(gradient.passion(`
████████╗ ██████╗  ██████╗ ███████╗████████╗██╗  ██╗███████╗██████╗  ██████╗ ██████╗ ██████╗ ██████╗ 
╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔══██╗
   ██║   ██║   ██║██║  ███╗█████╗     ██║   ███████║█████╗  ██████╔╝██║     ██║   ██║██████╔╝██║  ██║
   ██║   ██║   ██║██║   ██║██╔══╝     ██║   ██╔══██║██╔══╝  ██╔══██╗██║     ██║   ██║██╔══██╗██║  ██║
   ██║   ╚██████╔╝╚██████╔╝███████╗   ██║   ██║  ██║███████╗██║  ██║╚██████╗╚██████╔╝██║  ██║██████╔╝
   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝                                                                                         
    `));
    console.log(gradient.teen(`
    Le bot a démarré avec succès !
    \n\n`));
}