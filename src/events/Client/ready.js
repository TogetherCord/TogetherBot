const { log } = require("../../functions");
const ExtendedClient = require('../../class/ExtendedClient');
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
    TextInputStyle, StringSelectMenuOptionBuilder
} = require('discord.js');

const INTERVAL = 10000;
const ROLE_ID = '1187023556933079161';
const GUILD_ID = '1174431851658608660';

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} _ 
     * @param {import('discord.js').Client<true>} client 
     * @returns 
     */
    run: async(_, client) => {

        log('Logged in as: ' + client.user.tag, 'done');

        const statusChannel = client.channels.cache.get('1185999001816924221');
        const fetchedMessages = await statusChannel.messages.fetch({ limit: 1 });
        const statusMessage = fetchedMessages.first();

        setInterval(async () => {
            const connecteduser = await fetch('http://togethercord.unknownandev.me:3333/instance/containers/connected');
            const data = await connecteduser.json();
            const connectedIds = data.data;
            const idstonumber = connectedIds.length;

            const allinstance = await fetch('http://togethercord.unknownandev.me:3333/manager/status', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data2 = await allinstance.json();

            const ramusage = data2.averageRamUsageMB;
            const ramusage2 = ramusage.toFixed(2);

            const cpuusage = data2.averageCpuUsagePercent;
            const cpuusage2 = cpuusage.toFixed(2);

            const pingResponse = await fetch('http://togethercord.unknownandev.me:3333/manager/ping', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data3 = await pingResponse.json();
            const pingtoapi = data3.duration;

            const embed = new EmbedBuilder()
                .setTitle('TogetherCord - Status')
                .setDescription("Here you can see the status of the service.")
                .setColor('#2F3136')
                .addFields({ name: '<:Status:1189573575506677781> Connected Users', value: `**__${idstonumber} users__**`, inline: true })
                .addFields({ name: '<:RamLimit:1189573580850212874> Instance on the network', value: `**__${data2.containersLength} instance__**`, inline: true })
                .addFields({ name: '<:RamUsage:1189573578895663204> Ram Usage', value: `**__${ramusage2} MB__**`, inline: true })
                .addFields({ name: '<:CPU:1189573577679323147> Cpu Usage', value: `**__${cpuusage2}%__**`, inline: true })
                .addFields({ name: '<:security:1189603100953161729> Security', value: `**__60%__**`, inline: true })
                .addFields({ name: '<:firewall:1189603631801053296> DDoS Protection', value: `**__100%__**`, inline: true })
                .addFields({ name: '<:data:1189606195699392644> Data Protection', value: `**__100%__**`, inline: true })
                .addFields({ name: '<:firewal:1189606652085813258> Firewall', value: `**__100%__**`, inline: true })
                .addFields({ name: '<:ping:1189603946940084305> Ping', value: `**__${client.ws.ping}ms__**`, inline: true })
                .addFields({ name: '<:apiping:1189604565897724024> API Ping', value: `**__${pingtoapi}ms__**`, inline: true })
                .addFields({ name: '<:Member:1189607175950188574> Member Discord', value: `**__${client.users.cache.size} users__**`, inline: true })
                .addFields({ name: '<:boost:1189607245890203739> Boosts Discord', value: `**__${client.guilds.cache.get(GUILD_ID).premiumSubscriptionCount} boosts__**`, inline: true })
                .addFields({ name: '<:ai:1189608343904452649> Leana - Together AI', value: `**__100%__**`, inline: true})
                .addFields({ name: '<:bot:1189608660842852363> Yumiko - Together Cord', value: `**__100%__**`, inline: true })
                .addFields({ name: '<:page:1189608846906380409> Status - Page', value: `**__100%__**`, inline: true })
                .setTimestamp()
            statusMessage.edit({ embeds: [embed] });
        }, 10000);


        setInterval(async () => {
            try {
                const response = await fetch('http://togethercord.unknownandev.me:3333/instance/containers/connected');
                const data = await response.json();
                const connectedIds = data.data;

                const guild = client.guilds.cache.get(GUILD_ID);
                const role = guild.roles.cache.get(ROLE_ID);

                for (const member of guild.members.cache.values()) {
                    if (connectedIds.includes(member.id)) {
                        member.roles.add(role);
                    } else {
                        member.roles.remove(role);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des IDs connectés:', error);
            }
        }, INTERVAL);
    }
};