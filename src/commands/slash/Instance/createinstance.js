// Slash:

const { ChatInputCommandInteraction, SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
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

        await interaction.showModal(modal);
    }};