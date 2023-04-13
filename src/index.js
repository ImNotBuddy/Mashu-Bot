const { Client, Collection, GatewayIntentBits  } = require("discord.js");
require("dotenv/config");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

commandHandler(client);
eventHandler(client);

client.login(process.env.DISCORD_API_TOKEN);