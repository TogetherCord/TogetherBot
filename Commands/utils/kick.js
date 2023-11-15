const Discord = require('discord.js')

module.exports = {

    name: "kick",
    description: "Kick un utilisateur",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Utilisateur à kick",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "Raison du kick",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args){

        let user = args.getUser("membre")
        if(!user) return message.reply("Utilisateur introuvable")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Utilisateur introuvable")

        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison fournie"

        if(message.user.id == user.id) return message.reply("Vous ne pouvez pas vous kick vous-même")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Vous ne pouvez pas kick le propriétaire du serveur")
        if(member && !member.kickable) return message.reply("Vous ne pouvez pas kick ce membre")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Vous ne pouvez pas kick ce membre")

        try {await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison \`${reason}\``)} catch (err) {}

        await message.reply(`${user.tag} a été kick pour la raison : \`${reason}\``)

        await message.kick(reason)
    
    }

}