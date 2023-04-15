const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("latency")
		.setDescription("Replies with the bot's latency"),

    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        interaction.editReply(`\nClient latency: ${latency}ms\nWebsocket ping: ${client.ws.ping}ms`)
	}
}