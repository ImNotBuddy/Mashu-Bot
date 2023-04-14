const { Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("serverbanner")
		.setDescription("Get the banner of the current server"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const banner = interaction.guild.bannerURL()

        if (banner) {
            await interaction.reply(banner);
        } else{
            interaction.reply("This server does not have a banner.");
        }
	}
}