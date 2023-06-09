const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setActivity({ name: "/help", type: ActivityType.Listening });
        console.log(`${client.user.tag} is now ready and operational`);
	}
}