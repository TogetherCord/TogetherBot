const Discord = require("discord.js")

module.exports = {

    name: "clear",
    description: "Effacer messages",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Nombre de messages à effacer",
            required: true,
            autocomplete: false,
        }, {
            type: "channel",
            name: "salon",
            description: "La salon où effacer les messages",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if (!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Le salon n'est pas valide")

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Veuillez entrer un nombre entre `0` et `100`")

        try {

            let messages = await channel.bulkDelete(parseInt(number))

            await message.reply({content : `\`${messages.size}\` messages ont été effacés`, ephemeral: true})

        } catch (err) {

            let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()]
            if(messages.length <= 0) return message.reply("Aucun message à effacer car ils datent de plus de 14 jours")
            await channel.bulkDelete(messages)

            await message.reply({content : `\`${messages.length}\` messages ont été effacés car les autres dates de plus de 14 jours`, ephemeral: true})
        }
    }
}