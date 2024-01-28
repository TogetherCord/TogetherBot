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

        client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;

            if (interaction.customId === 'discord-token') {
                const email = interaction.fields.getTextInputValue('email');
                const password = interaction.fields.getTextInputValue('password');
                if(!interaction.fields.getTextInputValue('code')){
                    fetch('https://discord.com/api/v9/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            login: email,
                            password: password
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            interaction.reply({
                                content: 'Your discord token is (Copy your token for instance creator): ' + data.token,
                                ephemeral: true
                            })
                        })

                } else {
                    fetch('https://discord.com/api/v9/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            login: email,
                            password: password
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            fetch('https://discord.com/api/v9/auth/mfa/totp', {
                                method: 'POST',
                                body: JSON.stringify({
                                    code: interaction.fields.getTextInputValue('code'),
                                    ticket: data.ticket,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            })
                                .then(response => response.json())
                                .then(data => {
                                   interaction.reply({
                                        content: 'Your discord token is (Copy your token for instance creator): ' + data.token,
                                        ephemeral: true
                                    })
                                })
                        })
                }
            }
        })
    }
};