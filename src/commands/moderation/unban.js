const { Interaction, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unban a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("target")
                .setDescription("User ID of the user to unban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the unban")
                .setRequired(false)),
	/**
	 * 
	 * @param {Interaction} interaction 
	 */

    
	async execute(interaction) {
        const userID = interaction.options.getString("target");
        const reason = interaction.options.getString("reason") ?? "No reason was provided";

        try {
            await interaction.guild.members.unban(userID, reason);
            await interaction.reply(`Unbanned the user ID: ${userID}\nReason: ${reason}`);   
        } catch (error) {
            await interaction.reply(`Something went wrong. Most likely not a valid user ID`);   
            return;
        }
	}
}