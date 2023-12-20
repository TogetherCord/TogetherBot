const { log } = require("../../functions");
const ExtendedClient = require('../../class/ExtendedClient');

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
    run: (_, client) => {

        log('Logged in as: ' + client.user.tag, 'done');

        setInterval(async () => {
            try {
                const response = await fetch('http://localhost:3333/instance/containers/connected');
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