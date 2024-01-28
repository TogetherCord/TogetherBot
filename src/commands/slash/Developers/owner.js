const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle, StringSelectMenuOptionBuilder,
    AttachmentBuilder
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

let intervalId;

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Owner Dashboard'),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    options: {
        developers: true,
    },
    run: async (client, interaction) => {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('update')
                    .setLabel('Update')
                    .setEmoji('1190463492759756940')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('restart')
                    .setLabel('Restart')
                    .setEmoji('1190464803140030615')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('users')
                    .setLabel('Users')
                    .setEmoji('1190463990518779984')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.deferReply({ ephemeral: true });

        var embed = new EmbedBuilder()
            .setColor('#0042ff')
            .setTitle('Owner')
            .setDescription('hmmmm')
        embed.setThumbnail(client.user.displayAvatarURL({dynamic: true}));

        await interaction.user.send({embeds: [embed], components: [row1]});
        await interaction.editReply({ content: 'Check your dms !'});

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

            if (interaction.replied || interaction.deferred) return;

            try {
                await interaction.deferReply();
            } catch (error) {
                console.error('Error:', error);
                return;
            }

            if (interaction.isButton()) {
                switch (interaction.customId) {

                case 'users':

                    var embed = new EmbedBuilder()
                        .setColor('#0042ff')
                        .setTitle('Users')
                        .setDescription('Every users')
                    embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                    var message = await interaction.editReply({ embeds: [embed]});
                    setTimeout(() => {
                        message.delete().catch(console.error);
                    }, 20000);
                    break;

                    case 'update':
                  /*
                    let formData = new FormData()

                    formData.append('update', file);

                    fetch('http://localhost:3333/update/self', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(result => {
                        })
                        .catch(error => {
                        });


*/
                    var embed = new EmbedBuilder()
                        .setColor('#0042ff')
                        .setTitle('Updater - System TogetherCord')
                        .setDescription('Veuillez envoyer le fichier à envoyer sur le serveur en répondant à ce message')
                        embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                    var message = await interaction.editReply({ embeds: [embed]});


                    const filter = m => m.author.id === interaction.user.id;

                    const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });




                    default:
                        await interaction.reply('Unknown button');
                        break;
                }
            } else if (interaction.isStringSelectMenu()) {
                const selectedOption = interaction.values[0];

                switch (selectedOption) {

                    default:
                        var message = await interaction.editReply('Unknown option');
                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, 5000);
                        break;
                }
            }
        })
    }
}