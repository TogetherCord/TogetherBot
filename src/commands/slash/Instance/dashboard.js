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


        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start')
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('edit')
                    .setLabel('Settings')
                    .setStyle(ButtonStyle.Primary)
            );

        const hypebuttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('brilliance')
                    .setLabel('Brilliance')
                    .setEmoji('1189574267038334996')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('bravery')
                    .setLabel('Bravery')
                    .setEmoji('1189574270351835236')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('balance')
                    .setLabel('Balance')
                    .setEmoji('1189574268686696490')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('hypesquad-null')
                    .setLabel('Remove')
                    .setEmoji('1189677536762941461')
                    .setStyle(ButtonStyle.Danger)
            );

        const themebuttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('discord-dark')
                    .setLabel('Dark Theme')
                    .setEmoji('1189579697131114689')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('discord-light')
                    .setEmoji('1189579699312132096')
                    .setLabel('Light Theme')
                    .setStyle(ButtonStyle.Primary)
            )

        const statusbuttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('online')
                    .setLabel('Online')
                    .setEmoji('1189687026430246982')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('dnd')
                    .setLabel('Dnd')
                    .setEmoji('1189687031455035513')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('idle')
                    .setLabel('Idle')
                    .setEmoji('1189687036232347668')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('offline')
                    .setLabel('Offline')
                    .setEmoji('1189687043492675735')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('spoof-status')
                    .setLabel('Spoof Status')
                    .setEmoji('1189687032583294996')
                    .setStyle(ButtonStyle.Secondary)
            );

        const backupbuttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('backup-friends')
                    .setLabel('Backup Friends')
                    .setEmoji('1190084561028251728')
                    .setStyle(ButtonStyle.Secondary)
            )


        const menu = [
            {
                label: 'Themes',
                description: 'Choose Theme for your Discord Client',
                value: 'themes',
                emoji: '1189682788971053097'

            },
            {
                label: 'Hypesquad',
                description: 'Here you can choose your hypesquad',
                value: 'hypesquads',
                emoji: '1189580482145423502'
            },
            {
                label: 'Status',
                description: 'Here you can change your status, Online and other..',
                value: 'status',
                emoji: '1189687032583294996'
            },
            {
                label: 'Backup',
                description: 'Here you can find any backups tools',
                value: 'backup',
                emoji: '1190043480286834768'
            }
        ]
        const row2 = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectexecute-1')
                    .setPlaceholder('Execute command on instance')
                    .addOptions(
                        menu.map((item) => {
                            return new StringSelectMenuOptionBuilder()
                                .setLabel(item.label)
                                .setDescription(item.description)
                                .setValue(item.value)
                                .setEmoji(item.emoji)
                        })
                    )
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
                    embed.addFields({ name: '<:Status:1189573575506677781> Status', value: '<:StatusOn:1189573574063824906> Running', inline: true });
                } else if (data.status === 'exited') {
                    embed.addFields({ name: '<:Status:1189573575506677781> Status', value: '<:StatusOff:1189573571467546696> Stopped', inline: true });
                } else {
                    embed.addFields({ name: '<:Status:1189573575506677781> Status', value: 'Not created', inline: true });
                }

                if (data.data && data.data.uptime) {
                    const uptime = data.data.uptime;
                    const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                    embed.addFields({ name: '<:Uptime:1189573570444140625> Uptime', value: uptimeString, inline: true });
                }
                if (data.data) {
                embed.addFields({ name: '<:RamUsage:1189573578895663204> Memory Usage', value: `${data.data.memoryUsageMB}mb`, inline: true });
                embed.addFields({ name: '<:RamLimit:1189573580850212874> Memory Limit', value: `${data.data.memoryLimitMB}mb`, inline: true });
                embed.addFields({ name: '<:CPU:1189573577679323147> CPU Usage', value: `${data.data.cpuUsage}%`, inline: true });
                embed.addFields({name: '<:settings:1189591044275306606> Default Options', value: `Nitro Auto Claim : **__ON__** <:StatusOn:1189573574063824906>`, inline: false})
                }
                initialMessage = await interaction.user.send({ embeds: [embed], components: [row1, row2] });

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
                                newEmbed.addFields({ name: '<:Status:1189573575506677781> Status', value: '<:StatusOn:1189573574063824906> Running', inline: true });
                            } else if (data.status === 'exited') {
                                newEmbed.addFields({ name: '<:Status:1189573575506677781> Status', value: '<:StatusOff:1189573571467546696> Stopped', inline: true });
                            } else {
                                newEmbed.addFields({ name: '<:Status:1189573575506677781> Status', value: 'Not created', inline: true });
                            }

                            if (data.data && data.data.uptime) {
                                const uptime = data.data.uptime;
                                const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                                newEmbed.addFields({ name: '<:Uptime:1189573570444140625> Uptime', value: uptimeString, inline: true });
                            }

                            newEmbed.addFields({ name: '<:RamUsage:1189573578895663204> Memory Usage', value: `${data.data.memoryUsageMB}mb`, inline: true });
                            newEmbed.addFields({ name: '<:RamLimit:1189573580850212874> Memory Limit', value: `${data.data.memoryLimitMB}mb`, inline: true });
                            newEmbed.addFields({ name: '<:CPU:1189573577679323147> CPU Usage', value: `${data.data.cpuUsage}%`, inline: true });

                            newEmbed.addFields({name: '<:settings:1189591044275306606> Default Options', value: `Nitro Auto Claim : **__ON__** <:StatusOn:1189573574063824906>`, inline: false})

                            newEmbed.setTimestamp();

                            if (initialMessage) {
                                const message = await initialMessage;
                                await message.edit({ embeds: [newEmbed] });
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }, 10 * 1000);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        await interaction.editReply({ content: 'Check your dms !', ephemeral: true });

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

                    case 'discord-light':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'discord-light'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Discord Light')
                                    .setDescription('Your discord theme has been set to light !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.followUp({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });

                        break;

                    case 'discord-dark':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'discord-dark'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Discord Light')
                                    .setDescription('Your discord theme has been set to light !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.followUp({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });

                        break;
                    case 'bravery':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'hypesquad-bravery'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Hypesquad Bravery')
                                    .setDescription('Your hypesquad has been set to Bravery !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;

                    case 'brilliance':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'hypesquad-brilliance'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Hypesquad Brilliance')
                                    .setDescription('Your hypesquad has been set to Brilliance !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break

                    case 'balance':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'hypesquad-balance'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Hypesquad Balance')
                                    .setDescription('Your hypesquad has been set to Balance !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break

                    case 'hypesquad-null':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'hypesquad-none'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#f20000')
                                    .setTitle('Hypesquad removed')
                                    .setDescription('Your hypesquad has been removed !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;

                    case 'dnd':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'dnd'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#f20000')
                                    .setTitle('Status changed')
                                    .setDescription('Your status has been change to dnd')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;
                    case 'online':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'online'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#2cff00')
                                    .setTitle('Status changed')
                                    .setDescription('Your status has been change to online')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;
                    case 'offline':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'invisible'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#525252')
                                    .setTitle('Status changed')
                                    .setDescription('Your status has been change to offline')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;
                    case 'idle':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'idle'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#b6ae00')
                                    .setTitle('Status changed')
                                    .setDescription('Your status has been change to idle')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;

                    case 'spoof-status':
                        fetch('http://localhost:3333/instance/containers/execute',{
                            method : 'POST',
                            body : JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'status-spoof'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(async data => {
                                const embed = new EmbedBuilder()
                                    .setColor('#42f554')
                                    .setTitle('Spoof status')
                                    .setDescription('Your status has been spoofed !')
                                embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                var message = await interaction.editReply({ embeds: [embed] });

                                setTimeout(() => {
                                    message.delete().catch(console.error);
                                }, 5000);
                            })
                        break

                    case 'backup-friends':
                        fetch('http://localhost:3333/instance/containers/execute', {
                            method: 'POST',
                            body: JSON.stringify({
                                discordId: interaction.user.id,
                                action: 'backup-friends'
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                fetch('http://localhost:3333/files/download/', {
                                    method: 'GET'
                                })
                                    .then(response => response.arrayBuffer())
                                    .then(arrayBuffer => {
                                        const fileBuffer = Buffer.from(arrayBuffer);
                                        const attachment = new AttachmentBuilder(fileBuffer, { name: 'friends.json' });
                                        const embed = new EmbedBuilder()
                                            .setColor('#42f554')
                                            .setTitle('Backup Friends')
                                            .setDescription('Your friends has been backuped !')
                                        embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                                        return interaction.editReply({ embeds: [embed], files: [attachment] });
                                    })
                                    .then(async message => {
                                        setTimeout(async () => {
                                            await message.delete().catch(console.error);
                                        }, 10000);
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        break;




                default:
                    await interaction.reply('Unknown button');
                    break;
            }
            } else if (interaction.isStringSelectMenu()) {
                const selectedOption = interaction.values[0];

                switch (selectedOption) {

                    case 'status':
                        var embed = new EmbedBuilder()
                                .setColor('#0042ff')
                                .setTitle('Status')
                                .setDescription('Change your status')
                                .addFields({ name: 'Status', value: 'Online : **__For people who want to be online__**\nIdle : **__For people who want to be idle__**\nDnd : **__For people who want to be dnd__**\nOffline : **__For people who want to be offline__**', inline: false })
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                        var message = await interaction.editReply({ embeds: [embed], components: [statusbuttons] });

                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, 20000);
                        break;

                    case 'hypesquads':
                            var embed = new EmbedBuilder()
                                .setColor('#0042ff')
                                .setTitle('Hypesquad Houses')
                                .setDescription('Here you can select your Hypesquad Houses (The badges on your profile)')
                                .addFields({ name: 'Houses', value: 'Brilliance : **__For smart people__**\nBravery : **__For brave people__**\nBalance : **__For people who dont know what to choose__**', inline: false })
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                            var message = await interaction.editReply({ embeds: [embed], components: [hypebuttons] });
                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, 20000);
                        break;
                    case 'themes':
                            var embed = new EmbedBuilder()
                                .setColor('#0042ff')
                                .setTitle('Themes')
                                .setDescription('Select your Theme for your Discord Client !')
                                .addFields({ name: 'Basic Themes', value: 'Dark Theme : **__For normal people__**\nLight Theme : **__Bro i think.. you dont want to see.. if you click.. BLUD NO DONT DO THAT__**', inline: false })
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                           var message = await interaction.editReply({ embeds: [embed], components: [themebuttons]});
                            setTimeout(() => {
                                message.delete().catch(console.error);
                            }, 20000);
                        break;

                    case 'backup':
                        var embed = new EmbedBuilder()
                                .setColor('#0042ff')
                                .setTitle('Backup')
                                .setDescription('Here you can find any backup tools')
                                .addFields({ name: 'Backup', value: 'Backup Friends : **__Backup your friends to a json files__**', inline: false })
                            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                        var message = await interaction.editReply({ embeds: [embed], components: [backupbuttons]});
                        setTimeout(() => {
                            message.delete().catch(console.error);
                        }, 20000);
                        break;

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
};
