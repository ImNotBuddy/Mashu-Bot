const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

const { ownerID } = require("../../config.json")

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
        const botOwner = await client.users.fetch(ownerID)

        const infoEmbed = new EmbedBuilder()
        .setColor("Purple")
        .setThumbnail(client.user.avatarURL())
        .setTitle(`${client.user.username}`)
        .setDescription("Some information about me")
        .addFields(

            { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
            { name: "Users", value: `${client.users.cache.size}`, inline: true },
            { name: "Client ID", value: `${client.user.id}`, inline: true },

            { name: "Birthday", value: "My birthday is the 12th April" },
            { name: "Where does my name come from?", value: "My creator is a massive Fate fan and I am aswell" },
            { name: "My Hobbies", value: "I like helping others and cuddling Fou" }
        )
        .setFooter({ text: `Created by ${botOwner.username}#${botOwner.discriminator}`, iconURL: `${botOwner.avatarURL()}` })
        .setTimestamp();

		await interaction.reply({ embeds: [infoEmbed] });
	}
}