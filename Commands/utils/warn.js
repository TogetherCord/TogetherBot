const Discord = require("discord.js")

module.exports = {

    name: "warn",
    description: "Warn un utilisateur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur à warn",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "La raison du warn",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("utilisateur")
        if(!user) return message.reply("Veuillez mentionner un utilisateur")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Ce membre n'existe pas")

        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison fournie"

        if(message.user.id == user.id) return message.reply("Vous ne pouvez pas vous warn vous-même")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Vous ne pouvez pas warn le propriétaire du serveur")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Vous ne pouvez pas warn cet utilisateur")
        if((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Je ne peux pas warn ce membre")

        try { await user.send(`Tu as été warn sur le serveur **__${message.guild.name}__** par **${message.user.tag}** pour la raison : \`${reason}\``)} catch (err) {}

        await message.reply(`**${user.tag}** a été warn pour la raison : \`${reason}\``)

        let ID = await bot.function.createId("WARN")

        db.query(`INSERT INTO warns (guild, user, author, warn, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
    }
}