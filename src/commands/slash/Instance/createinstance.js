// Slash:

const { ChatInputCommandInteraction, SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle, Embed, ComponentType
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('createinstance')
        .setDescription('Create an instance for TogetherCord'),
    options: {
        developers: true,
    },
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const cguEmbed = new EmbedBuilder()
            .setTitle('Terms of Service')
            .setDescription('Please read the terms of service before creating an instance. If you agree, click on the "Accept" button. If you disagree, click on the "Decline" button.')
            .setColor('#FF0000')
            .addFields({
                name: 'TogetherCord Terms of Service',
                value: 'By creating an instance, you agree to the terms of service, which can be found [On this Page](https://unknownandev.me/togethercord/index.html).',
                inline: true
            })



        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Decline')
                    .setStyle(ButtonStyle.Danger)
            );

        const msg = await interaction.reply({
            embeds: [cguEmbed],
            components: [row]
        });

        const modal = new ModalBuilder()
            .setTitle('Create your instance !')
            .setCustomId('instance-creator')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Your discord token : (account)')
                            .setCustomId('token')
                            .setPlaceholder('Type your token here')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            );

        const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button, time: 60000})
        
        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.deferReply({content: "Vous ne pouvez pas utiliser ce bouton", ephemeral: true})
            if (i.customId === 'accept') {
                await i.showModal(modal);
            } else if (i.customId === 'decline') {
                i.reply({content: "Vous avez refusé les conditions générales d\'utilisation", ephemeral: true})
                await msg.edit({components: []})
            }
        })

        setInterval(() => {
            msg.edit({components: []})
        }, 60000);
    }};