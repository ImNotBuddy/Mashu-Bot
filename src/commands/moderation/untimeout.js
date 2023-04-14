const { Interaction, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const ms = require("ms")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("untimeout")
		.setDescription("Remove the timeout for a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User to user timeout")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the untimeout")
                .setRequired(false)),
	/**
	 * 
	 * @param {Interaction} interaction 
	 */

    
	async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "No reason was provided";

        const user = await interaction.guild.members.fetch(target);


        if (user.user.bot) {
            await interaction.reply("Cannot untimeout a bot.");
            return;
        }

        if (!user.isCommunicationDisabled()) {
            await interaction.reply(`${user} is not currently timed out.`);
            return;
        }

        await user.timeout(null, reason);
        await interaction.reply(`${user}'s timeout was removed.\nReason: ${reason}`);  
	}
}