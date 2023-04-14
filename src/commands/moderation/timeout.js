const { Interaction, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const ms = require("ms")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Timeout a user. The time must be one type of measurement (e.g seconds) and not multiple")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User to user timeout")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("time")
                .setDescription("How long to time out the user. Contractions work, e.g 5s, 30mins, 1.5hrs, 2 days, 3.5 weeks")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the timeout")
                .setRequired(false)),
	/**
	 * 
	 * @param {Interaction} interaction 
	 */

    
	async execute(interaction) {
        const target = interaction.options.getUser("target");
        const time = interaction.options.getString("time");
        const reason = interaction.options.getString("reason") ?? "No reason was provided";

        const user = await interaction.guild.members.fetch(target);
        const msDuration = ms(time);

        if (user.user.bot) {
            await interaction.reply("Cannot timeout a bot.");
            return;
        }

        if (isNaN(msDuration)) {
            await interaction.reply("That is not a valid timeout duration.");
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.reply("Timeout duration must be greater than 5 seconds but less than 28 days.");
            return;
        }

        try {
            const { default: prettyMs } = await import("pretty-ms")
            await user.timeout(msDuration, reason);

            if (user.isCommunicationDisabled()) {
                await user.timeout(msDuration, reason);
                await interaction.reply(`${user}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
                return;
            }

            await user.timeout(msDuration, reason);
            await interaction.reply(`${user} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);  
        } catch (error) {
            return;
        }
	}
}