const { Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping2")
		.setDescription("Replies with Pong!"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        //const client = interaction.client;
		await interaction.reply("Pong!");
	},
}