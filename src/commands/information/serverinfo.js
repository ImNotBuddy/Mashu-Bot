const { ChannelType, EmbedBuilder, Interaction, Role, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("serverinfo")
		.setDescription("Get server related information"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        
        const guild = interaction.guild;
        const guildOwner = await guild.members.fetch(guild.ownerId);

        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
            .setTitle("Server Information")
            .setDescription(`**Server Description**:\n${guild.description}`)
            .addFields(
                { name: "Owner", value: `${guildOwner.user}`, inline: true },
                { name: "Creation Date", value: `<t:${parseInt(guild.createdAt / 1000)}:R>`, inline: true },
                { name: "Server ID", value: `${guild.id}`, inline: true },

                { name: "Channels", value: `${guild.channels.cache.filter(channel => channel.type !== ChannelType.GuildCategory).size}`, inline: true },
                { name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
                { name: "Server Level", value: `${guild.premiumTier}`, inline: true },
                
                { name: "Members", value: `${guild.memberCount}`, inline: true },
                { name: "Custom Emojis", value: `${guild.emojis.cache.size}`, inline: true },
                { name: "Total Roles", value: `${guild.roles.cache.filter(role => role.id !== guild.roles.everyone.id).size}`, inline: true },
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
	},
}