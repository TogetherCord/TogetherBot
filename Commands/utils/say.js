const Discord = require("discord.js")

module.exports = {

    name: "say",
    description: "Répète ce que tu dis",
    permission: "Aucune",
    dm: false,
    category: "Fun",
    options: [
        {
            type: "string",
            name: "message",
            description: "message à répéter",
            required: true,
            autocomplete: false,
        }
    ],

async run(bot, message, args) {
    
        let mess = args.getString("message")
        if(!mess) mess = "Aucun message fourni"
        message.channel.send(`${mess}`)
        await message.reply({
            content: `Message envoyé !`,
            ephemeral: true
        })

    }
}