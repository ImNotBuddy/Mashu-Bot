const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with the bot's ping"),

    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        interaction.editReply(`Pong!\nClient Ping: ${ping}ms\nWebsocket Ping: ${client.ws.ping}ms`)
	}
}