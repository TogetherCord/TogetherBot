const 
    Discord = require('discord.js')
    Canvas = require('discord-canvas-easy')


module.exports = {

    name: "rank",
    description: "Affiche l'xp d'un membre",
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'xp du membre à voir",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db){

        let user;
        if(args.getUser("utilisateur")) {
            user = args.getUser("utilisateur")
            if(!user || !message.guild.members.cache.get(user?.id)) return message.reply("Utilisateur introuvable")
        } else user = message.user;

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, all) => {
                
                if(req.length < 1) return message.reply("Ce membre n'a pas d'xp !")

                await message.deferReply()

                const calculXp = (xp, level) => {
                    let xptotal = 0;
                    for(let i = 0; i < level + 1; i++) xptotal += i * 1000
                    xptotal += xp;
                    return xptotal;
                }

                let leaderboard = await all.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
                let xp = parseInt(req[0].xp)
                let level = parseInt(req[0].level)
                let rank = leaderboard.findIndex(r => r.user === user.id) + 1
                let need = (level + 1) * 1000;

                let Card = await new Canvas.Card()
                .setBackground("https://img.freepik.com/photos-premium/salle-studio-vide-neon-violet-rose-bleu-fonce-fond-abstrait-lumiere-ombre_44706-398.jpg")
                .setBot(bot)
                .setColorFont("#ffffff")
                .setRank(rank)
                .setUser(user)
                .setColorProgressBar("#ff0000")
                .setGuild(message.guild)
                .setXp(xp)
                .setLevel(level)
                .setXpNeed(need)
                .toCard()

                await message.followUp({files: [new Discord.AttachmentBuilder(Card.toBuffer(), {name: "rank.png"})]})

            })


        })
    
    }

}