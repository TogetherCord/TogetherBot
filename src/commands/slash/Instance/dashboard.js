const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("dashboard")
        .setDescription("You can manage your instance here ! (in dms)"),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */

    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const response = await fetch(
                "http://togethercord.unknownandev.me:3333/instance/containers/exists", {
                    method: "POST",
                    body: JSON.stringify({
                        discordId: interaction.user.id,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                    },
                }
            );

            const data = await response.json();

            if (data.status === "error") {
                const embed = new EmbedBuilder()
                    .setColor("#f20000")
                    .setTitle("No instance detected")
                    .setDescription(
                        "No instance was detected. Please run the **__/createinstance__** command to create an instance."
                    )
                    .addFields({
                        name: "After creating your instance :",
                        value: "Just do **__/dashboard__**",
                        inline: true,
                    });
                await interaction.editReply({
                    embeds: [embed]
                });
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("start")
            .setLabel("Start")
            .setEmoji("1190143453250732052")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("stop")
            .setLabel("Stop")
            .setEmoji("1190143455024922704")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("Delete")
            .setEmoji("1190143456346116126")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("edit")
            .setLabel("Settings")
            .setEmoji("1190144206598062131")
            .setStyle(ButtonStyle.Primary)
        );

        const menu = [{
                label: "Themes",
                description: "Choose Theme for your Discord Client",
                value: "themes",
                emoji: "1189682788971053097",
            },
            {
                label: "Hypesquad",
                description: "Here you can choose your hypesquad",
                value: "hypesquads",
                emoji: "1189580482145423502",
            },
            {
                label: "Status",
                description: "Here you can change your status, Online and other..",
                value: "status",
                emoji: "1189687032583294996",
            },
            {
                label: "Samsung Spoof",
                description: "Here you can spoof your status to samsung activity",
                value: "samsungrpc",
                emoji: "1190143461203128361",
            },
            {
                label: "Backup",
                description: "Here you can find any backups tools",
                value: "backup",
                emoji: "1190043480286834768",
            },
        ];
        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("selectexecute-1")
            .setPlaceholder("Execute command on instance")
            .addOptions(
                menu.map((item) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(item.label)
                        .setDescription(item.description)
                        .setValue(item.value)
                        .setEmoji(item.emoji);
                })
            )
        );

        let initialMessage;

        fetch(
                "http://togethercord.unknownandev.me:3333/instance/containers/status", {
                    method: "POST",
                    body: JSON.stringify({
                        discordId: interaction.user.id,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                    },
                }
            )
            .then((response) => response.json())
            .then(async (data) => {
                const embed = new EmbedBuilder()
                    .setTitle("Manage your instance")
                    .setDescription(
                        "Hey welcome to your instance manager, you can manage your instance here !"
                    );
                embed.setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }));

                if (data.status === "running") {
                    embed.addFields({
                        name: "<:Status:1189573575506677781> Status",
                        value: "<:StatusOn:1189573574063824906> Running",
                        inline: true,
                    });
                } else if (data.status === "exited") {
                    embed.addFields({
                        name: "<:Status:1189573575506677781> Status",
                        value: "<:StatusOff:1189573571467546696> Stopped",
                        inline: true,
                    });
                } else {
                    embed.addFields({
                        name: "<:Status:1189573575506677781> Status",
                        value: "Not created",
                        inline: true,
                    });
                }

                if (data.data && data.data.uptime) {
                    const uptime = data.data.uptime;
                    const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                    embed.addFields({
                        name: "<:Uptime:1189573570444140625> Uptime",
                        value: uptimeString,
                        inline: true,
                    });
                }
                if (data.data) {
                    embed.addFields({
                        name: "<:RamUsage:1189573578895663204> Memory Usage",
                        value: `${data.data.memoryUsageMB}mb`,
                        inline: true,
                    });
                    embed.addFields({
                        name: "<:RamLimit:1189573580850212874> Memory Limit",
                        value: `${data.data.memoryLimitMB}mb`,
                        inline: true,
                    });
                    embed.addFields({
                        name: "<:CPU:1189573577679323147> CPU Usage",
                        value: `${data.data.cpuUsage}%`,
                        inline: true,
                    });
                    embed.addFields({
                        name: "<:settings:1189591044275306606> Default Options",
                        value: `Nitro Auto Claim : **__ON__** <:StatusOn:1189573574063824906>`,
                        inline: false,
                    });
                }
                initialMessage = await interaction.user.send({
                    embeds: [embed],
                    components: [row1, row2],
                });

                intervalId = setInterval(async () => {
                    fetch(
                            "http://togethercord.unknownandev.me:3333/instance/containers/status", {
                                method: "POST",
                                body: JSON.stringify({
                                    discordId: interaction.user.id,
                                }),
                                headers: {
                                    "Content-Type": "application/json",
                                    "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                                },
                            }
                        )
                        .then((response) => response.json())
                        .then(async (data) => {
                            const newEmbed = new EmbedBuilder()
                                .setTitle("Manage your instance")
                                .setDescription(
                                    "Hey welcome to your instance manager, you can manage your instance here !"
                                );
                            newEmbed.setThumbnail(
                                client.user.displayAvatarURL({
                                    dynamic: true
                                })
                            );

                            if (data.status === "running") {
                                newEmbed.addFields({
                                    name: "<:Status:1189573575506677781> Status",
                                    value: "<:StatusOn:1189573574063824906> Running",
                                    inline: true,
                                });
                            } else if (data.status === "exited") {
                                newEmbed.addFields({
                                    name: "<:Status:1189573575506677781> Status",
                                    value: "<:StatusOff:1189573571467546696> Stopped",
                                    inline: true,
                                });
                            } else {
                                newEmbed.addFields({
                                    name: "<:Status:1189573575506677781> Status",
                                    value: "Not created",
                                    inline: true,
                                });
                            }

                            if (data.data && data.data.uptime) {
                                const uptime = data.data.uptime;
                                const uptimeString = `${uptime.months} months, ${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`;
                                newEmbed.addFields({
                                    name: "<:Uptime:1189573570444140625> Uptime",
                                    value: uptimeString,
                                    inline: true,
                                });
                            }

                            newEmbed.addFields({
                                name: "<:RamUsage:1189573578895663204> Memory Usage",
                                value: `${data.data.memoryUsageMB}mb`,
                                inline: true,
                            });
                            newEmbed.addFields({
                                name: "<:RamLimit:1189573580850212874> Memory Limit",
                                value: `${data.data.memoryLimitMB}mb`,
                                inline: true,
                            });
                            newEmbed.addFields({
                                name: "<:CPU:1189573577679323147> CPU Usage",
                                value: `${data.data.cpuUsage}%`,
                                inline: true,
                            });

                            newEmbed.addFields({
                                name: "<:settings:1189591044275306606> Default Options",
                                value: `Nitro Auto Claim : **__ON__** <:StatusOn:1189573574063824906>`,
                                inline: false,
                            });

                            newEmbed.setTimestamp();

                            if (initialMessage) {
                                const message = await initialMessage;
                                await message.edit({
                                    embeds: [newEmbed]
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                }, 10 * 1000);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        await interaction.editReply({
            content: "Check your dms !",
            ephemeral: true,
        });
    },
};