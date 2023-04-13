const { Client, EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("botinfo")
		.setDescription("Replies with bot-related information"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const client = interaction.client;

        const infoEmbed = new EmbedBuilder()
        .setColor("Purple")
        .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.avatarURL()}` })
        .setThumbnail(client.user.avatarURL())
        .setDescription("Some information about me")
        .addFields(
            { name: "Birthday", value: "My birthday is the 12th April. I was created by ImNotBuddy." },
            { name: "Where does my name come from?", value: "My creator is a massive Fate fan and so am I." },
            { name: "My Hobbies", value: "I like helping others and cuddling Fou" }
        )
        .setTimestamp();

		await interaction.reply({ embeds: [infoEmbed] });
	},
};