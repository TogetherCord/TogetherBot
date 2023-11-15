const 
    Discord = require('discord.js'),
    { exec } = require('child_process')

module.exports = {

    name: "start",
    description: "Secret command",
    permission: Discord.PermissionFlagsBits.Administrator,
    category:"Owner",
    dm: true,
    options: [
        {
            type: "string",
            name: "selfbot",
            description: "Choisir le selfbot",
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        if(message.user.id !== '635536565434581043') {
            return message.reply({
              content: `Cette commande est destinée au fondateur du bot`,
              ephemeral: true
          })
          }

        let self = args.getString("selfbot")
        if(self !== "LP" && self !== "PTS") return message.reply("Merci de choisir un selfbot parmi la sélection")

        if(self === "PTS") {
            message.reply('**__ProtectToolsSelfbot__ lancé**').then(() => {
              exec('cd D:\\Users\\ia_nah && start D:\\Users\\ia_nah\\Desktop\\Dev\\ProtectTools\\start.bat', (error, stdout, stderr) => {
                if (error) {
                  message.channel.send(`Une erreur est survenue : ${error.message}`);
                }
              });
            });
          } else if(self === "LP") {
                message.reply('**__Code: Project__ lancé**').then(() => {
                exec('cd D:\\Users\\ia_nah && start D:\\Users\\ia_nah\\Desktop\\Dev\\ProtectTools\\Selfbot.bat', (error, stdout, stderr) => {
                    if (error) {
                    message.channel.send(`Une erreur est survenue : ${error.message}`);
                    }
                });
                });
            }
        }

    }