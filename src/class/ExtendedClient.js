const { Client, Partials, Collection, GatewayIntentBits, ActivityType } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");

module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    };
    applicationcommandsArray = [];

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
        });
    };

    async displayConnectedUsers() {
        try {
            const response = await fetch('http://togethercord.unknownandev.me:3333/instance/containers/connected', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "x-api-key": "OmZ5TDJRARai4P0617sL0IIB3oV1CzxP"
                }
            });
            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                return;
            }
            const data = await response.json();
            const connectedIds = data.data;

            await this.user.setPresence({
                activities: [{
                    name: `${connectedIds.length} User connected to the instance`,
                    type: ActivityType.WATCHING,
                    status: 'dnd'
                }]
            });
        } catch (error) {
            console.error('Error fetching connected IDs:', error);
        }
    }

    start = async () => {
        commands(this);
        events(this);
        components(this);

        if (config.handler.mongodb.toggle) mongoose();

        await this.login(process.env.CLIENT_TOKEN || config.client.token);
        this.setMaxListeners(0);

        if (config.handler.deploy) deploy(this, config);
        setInterval(() => this.displayConnectedUsers(), 1000);
    };
};
