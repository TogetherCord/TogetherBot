const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  AttachmentBuilder
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
  event: "interactionCreate",
  once: false,
  /**
   *
   * @param {ExtendedClient} _
   * @param {import('discord.js').Client<true>} client
   * @returns
   */
  run: async (client, interaction) => {

    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    if (interaction.replied || interaction.deferred) return;

    try {
      await interaction.deferReply();
      if (interaction.isButton()) {
        console.log(`Received button interaction with customId: ${interaction.customId}`);
        switch (interaction.customId) {
          case "update":
            if (!interaction.deferred && !interaction.replied) {
              await interaction.deferReply();
              const embed = new EmbedBuilder()
                  .setColor("#42f554")
                  .setTitle("Update")
                  .setDescription("Drop the latest version files here to update the bot");
              embed.setThumbnail(
                  client.user.displayAvatarURL({ dynamic: true })
              );

              var message = await interaction.editReply({ embeds: [embed] });

              setTimeout(() => {
                message.delete().catch(console.error);
              }, 5000);
            }
            break;

          default:
            var message = await interaction.editReply("Unknown option");
            setTimeout(() => {
              message.delete().catch(console.error);
            }, 5000);
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};