// Slash:

const { ChatInputCommandInteraction, SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle, Embed
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
            .setDescription('By creating an instance, you agree to the terms of service.')
            .setColor('#FF0000')


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

        await interaction.reply({
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



        client.once('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;
            if (interaction.customId === 'accept') {
                await interaction.showModal(modal);
            } else if (interaction.customId === 'refuse') {
                await interaction.deferReply('Vous avez refusé les conditions générales d\'utilisation.');
            }
        });

    }};