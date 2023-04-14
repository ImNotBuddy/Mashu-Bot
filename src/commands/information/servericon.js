const { Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("servericon")
		.setDescription("Get the icon of the current server"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const icon = interaction.guild.iconURL()

        if (icon) {
            await interaction.reply(icon);
        } else{
            interaction.reply("This server does not have an icon.");
        }
	}
}