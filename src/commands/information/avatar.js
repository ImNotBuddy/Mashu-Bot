const { Interaction, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv/config")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Get the avatar of a user, in or outside of the server")
		.addUserOption(option => 
			option.setName("target")
				.setDescription("User whose avatar you want. Use ID (if outside of the server) or ping. Leave blank for yours")
				.setRequired(false)),
                

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const target = interaction.options.getUser("target") ?? interaction.user;
		const URL = `https://discord.com/api/users/${target.id}`;
		const token = process.env.DISCORD_API_TOKEN;

		try {
			const response = await axios.get(URL, { headers: { Authorization: `Bot ${token}` } });

			if (response.status != 200) {
                await interaction.reply("An unexpected error occured when trying to get that users profile picture")
            }

            let avatar = response.data.avatar;
			
			if (avatar) {
				const format = avatar.startsWith("a_") ? "gif" : "webp";
				avatar = `https://cdn.discordapp.com/avatars/${target.id}/${avatar}.${format}?size=4096`;
				await interaction.reply({ content: avatar, ephemeral: false });
			} else {
                await interaction.reply({ content: "This user does not have a valid avatar" });
            }

		} catch (error) {
			await interaction.reply("An unexpected error occured when trying to get that users avatar");
		}
	},
}