const { Interaction, PermissionFlagsBits, SlashCommandBuilder, GuildBan } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kick a user from the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Ping the user to kick")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(false)),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const client = interaction.client;
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "No reason was provided";
        
        try {
            client.users.send(target.id, `You where kicked for: ${reason}`);
            await interaction.reply(`Kicked: ${target.username}#${target.discriminator}\nReason: ${reason}`);
            await interaction.guild.members.kick(target, reason);
        } catch (error) {
            return;
        }
	},
}