const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
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
				await interaction.reply("An unexpected error occured when trying to get that users profile picture.")
			}

			if (!response.data.avatar) {
				await interaction.reply({ content: "This user does not have a valid avatar." });
				return;
			}

			const format = response.data.avatar.startsWith("a_") ? "gif" : "webp";

			const avatar = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.${format}?size=4096`;
			const avatarPNG = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.jpg?size=4096`;
			const avatarJPG = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.png?size=4096`;

			const avatarEmbed = new EmbedBuilder()
				.setColor("Random")
				.setTitle(`Avatar for ${target.username}`)
				.setImage(avatar)
				.setTimestamp();

			if (format === "gif") {
				avatarEmbed.setDescription(`Direct Link: [gif](${avatar})`)
			} else {
				avatarEmbed.setDescription(`Direct Links: [WebP](${avatar}) | [PNG](${`${avatarPNG}`}) | [JPG](${`${avatarJPG}`})`)
			}

			await interaction.reply({ embeds: [avatarEmbed] });

		} catch (error) {
			await interaction.reply("An unexpected error occured when trying to get that users avatar.");
		}
	}
}