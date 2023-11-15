const Discord = require("discord.js")

module.exports = {

    name: "warnlist",
    description: "Affiche les warns d'un membre",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            name: "membre",
            description: "Membre à afficher",
            type: "user",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if (!user) return message.reply("Veuillez mentionner un membre")
        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("Ce membre n'existe pas")

        db.query(` SELECT * FROM warns WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            if(req.length < 1) return message.reply("Aucun warn n'a été trouvé")
            await req.sort((a, b) => parseInt(a.date) - parseInt(b.date))

            let Embed = new Discord.EmbedBuilder()
            .setColor("#E10000")
            .setTitle(`Warns de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Warns"})

            for(let i = 0; i < req.length; i++) {

                Embed.addFields([{name: `Warn ${i + 1}`, value: `> **Auteur** : \`${(await bot.users.fetch(req[i].author)).tag}\`\n> **ID** : \`${req[i].warn}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:F>`}])
            }

            await message.reply({embeds: [Embed]})
        })
    }
}