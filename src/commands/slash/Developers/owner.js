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
const ExtendedClient = require("../../../class/ExtendedClient");
const GetInstanceNumber = require("../../../class/Request/GetInstanceNumber");
const GetConnected = require("../../../class/Request/GetConnected");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName("owner")
        .setDescription("A owner dashboard for TogetherCord"),
    /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */

    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true});
            const developerid = require("../../../config.js").users.developers;
            if (!developerid.includes(interaction.user.id)) {
                await interaction.editReply({
                    content: "You are not authorized to use this command",
                    ephemeral: true,
                });
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("update")
                .setLabel("Update")
                .setEmoji("1190143453250732052")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("restart")
                .setLabel("Restart All")
                .setEmoji("1190143455024922704")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("users")
                .setLabel("Users")
                .setEmoji("1190143456346116126")
                .setStyle(ButtonStyle.Danger),
        );

        const instanceNumber = await GetInstanceNumber()

        const connectedcall = await GetConnected()
        const connected = connectedcall.data.length

        var embed = new EmbedBuilder()
            .setTitle("Owner Dashboard")
            .setDescription("Welcome to the owner dashboard. Here you can update, restart or view users.")
            .setColor("#00ffd8")
            .addFields({
                name: "<:RamUsage:1189573578895663204> How many instances are created :",
                value: `**__${instanceNumber} Instances__**`,
                inline: true
            })
            .addFields({
                name: "<:Status:1189573575506677781> How many users are connected :",
                value: `**__${connected} Users__**`,
                inline: true
            })
        embed.setThumbnail(client.user.displayAvatarURL({dynamic: true}))

        await interaction.user.send({
            embeds: [embed],
            components: [row1]
        });

        await interaction.editReply({
            content: "Check your dms !",
            ephemeral: true,
        });
    },
};