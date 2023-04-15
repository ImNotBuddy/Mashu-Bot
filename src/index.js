const { Client, Collection, GatewayIntentBits  } = require("discord.js");
require("dotenv/config");

const process = require("node:process");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");

const { connect } = require("mongoose");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.commands = new Collection();

commandHandler(client);
eventHandler(client);

process.on("unhandledRejection", (reason, promise) => {
    console.log("UnhandledRejection at:", promise, "Reason:", reason);
});

(async () => {
    await connect(process.env.MONGODB_TOKEN).catch(console.error);
})();

client.login(process.env.DISCORD_API_TOKEN);