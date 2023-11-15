const 
    Discord = require('discord.js')
    Canvas = require('discord-canvas-easy')


module.exports = {

    name: "leaderboard",
    description: "Affiche le classement d'expérience",
    permission: "Aucune",
    dm: false,
    category: "Expérience",

    async run(bot, message, args, db){

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, req) => {

            if(req.length < 1) return message.reply("Aucun utilisateur n'a d'xp")

            await message.deferReply()

            const calculXp = (xp, level) => {
                let xptotal = 0;
                for(let i = 0; i < level + 1; i++) xptotal += i * 1000
                xptotal += xp;
                return xptotal;
            }

            let leaderboard = await req.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))

            const Leaderboard = await new Canvas.Leaderboard()
            .setBot(bot)
            .setGuild(message.guild)
            .setBackground("https://png.pngtree.com/thumb_back/fh260/background/20200621/pngtree-abstract-modern-neon-frame-background-image_339537.jpg")
            .setColorFont("#ffffff")

            for(let i = 0; i < (req.length > 10 ? 10 : req.length); i++){

                await Leaderboard.addUser(await bot.users.fetch(leaderboard[i].user), parseInt(leaderboard[i].level), parseInt(leaderboard[i].xp), (parseInt(leaderboard[i].level) + 1) * 1000)
            }

            const Image = await Leaderboard.toLeaderboard()

            await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), {name: "leaderboard.png"})]})

        })
    
    }

}