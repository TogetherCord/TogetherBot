const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

let intervalId;

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('You can manage your instance here ! (in dms)'),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const response = await fetch('http://localhost:3333/instance/containers/exists', {
                method: 'POST',
                body: JSON.stringify({
                    discordId: interaction.user.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.status === 'error') {
                const embed = new EmbedBuilder()
                    .setColor('#f20000')
                    .setTitle('No instance detected')
                    .setDescription('No instance was detected. Please run the **__/createinstance__** command to create an instance.')
                    .addFields({ name: 'After creating your instance :', value: "Just do **__/dashboard__**", inline: true })
                await interaction.editReply({ embeds: [embed] });
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start')
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('execute')
                    .setLabel('Execute')
                    .setStyle(ButtonStyle.Success)
            );

        let initialMessage;

        fetch('http://localhost:3333/instance/containers/status', {
            method: 'POST',
            body: JSON.stringify({
                discordId: interaction.user.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(async data => {
                const embed = new EmbedBuilder()
                    .setTitle('Manage your instance')
                    .setDescription('Hey welcome to your instance manager, you can manage your instance here !')
                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                if (data.status === 'running') {
                    embed.addFields({ name: 'Status', value: 'Running', inline: true });
                } else if (data.status === 'exited') {
                    embed.addFields({ name: 'Status', value: 'Stopped', inline: true });
                } else {
                    embed.addFields({ name: 'Status', value: 'Not created', inline: true });
                }

                if (data.data && data.data.uptime) {
                    const uptime = data.data.uptime;
                    const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                    embed.addFields({ name: 'Uptime', value: uptimeString, inline: true });
                }
                if (data.data) {
                embed.addFields({ name: 'Memory Usage', value: `${data.data.memoryUsageMB}mb`, inline: true });
                embed.addFields({ name: 'Memory Limit', value: `${data.data.memoryLimitMB}mb`, inline: true });
                embed.addFields({ name: 'CPU Usage', value: `${data.data.cpuUsage}%`, inline: true });
                }
                initialMessage = await interaction.user.send({ embeds: [embed], components: [row] });

                intervalId = setInterval(async () => {
                    fetch('http://localhost:3333/instance/containers/status', {
                        method: 'POST',
                        body: JSON.stringify({
                            discordId: interaction.user.id
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(async data => {
                            const newEmbed = new EmbedBuilder()
                                .setTitle('Manage your instance')
                                .setDescription('Hey welcome to your instance manager, you can manage your instance here !')
                            newEmbed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                            if (data.status === 'running') {
                                newEmbed.addFields({ name: 'Status', value: 'Running', inline: true });
                            } else if (data.status === 'exited') {
                                newEmbed.addFields({ name: 'Status', value: 'Stopped', inline: true });
                            } else {
                                newEmbed.addFields({ name: 'Status', value: 'Not created', inline: true });
                            }

                            if (data.data && data.data.uptime) {
                                const uptime = data.data.uptime;
                                const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                                newEmbed.addFields({ name: 'Uptime', value: uptimeString, inline: true });
                            }

                            newEmbed.addFields({ name: 'Memory Usage', value: `${data.data.memoryUsageMB}mb`, inline: true });
                            newEmbed.addFields({ name: 'Memory Limit', value: `${data.data.memoryLimitMB}mb`, inline: true });
                            newEmbed.addFields({ name: 'CPU Usage', value: `${data.data.cpuUsage}%`, inline: true });

                            newEmbed.setTimestamp();

                            if (initialMessage) {
                                const message = await initialMessage;
                                await message.edit({ embeds: [newEmbed] });
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }, 60 * 1000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        await interaction.editReply({ content: 'Check your dms !', ephemeral: true });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            await interaction.deferReply();

            switch (interaction.customId) {
                case 'start':
                    fetch('http://localhost:3333/instance/containers/start', {
                        method: 'POST',
                        body: JSON.stringify({
                            discordId: interaction.user.id
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(async data => {
                            const embed = new EmbedBuilder()
                                .setColor('#42f554')
                                .setTitle('Instance started')
                                .setDescription('Your instance has been started !')
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                            const message = await interaction.editReply({ embeds: [embed] });

                            setTimeout(() => {
                                message.delete().catch(console.error);
                            }, 5000);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                    break;

                case 'stop':
                    fetch('http://localhost:3333/instance/containers/stop', {
                        method: 'POST',
                        body: JSON.stringify({
                            discordId: interaction.user.id
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(async data => {
                            const embed = new EmbedBuilder()
                                .setColor('#f20000')
                                .setTitle('Instance stopped')
                                .setDescription('Your instance has been stopped !')
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                            const message = await interaction.editReply({ embeds: [embed] });

                            setTimeout(() => {
                                message.delete().catch(console.error);
                            }, 5000);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                    break;

                case 'delete':
                    fetch('http://localhost:3333/instance/containers/delete', {
                        method: 'POST',
                        body: JSON.stringify({
                            discordId: interaction.user.id
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(async data => {
                            const embed = new EmbedBuilder()
                                .setColor('#f20000')
                                .setTitle('Instance deleted')
                                .setDescription('Your instance has been deleted !')
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                            const message = await interaction.editReply({ embeds: [embed] });

                            setTimeout(() => {
                                message.delete().catch(console.error);
                            }, 5000);

                            clearInterval(intervalId);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                    break;
                default:
                    await interaction.reply('Unknown button');
                    break;
            }
        });
    }
};