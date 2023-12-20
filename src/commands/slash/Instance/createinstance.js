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

        client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;

            if (interaction.customId === 'instance-creator') {
                const token = interaction.fields.getTextInputValue('token');
                const userid = interaction.user.id;
                fetch('http://localhost:3333/instance/containers/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        token: token,
                        discordId: userid
                    }),
                    headers: {
                        'Content-Type': 'application/json'
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
                })}
        });
    }};



