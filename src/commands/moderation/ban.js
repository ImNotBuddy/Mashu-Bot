const { Interaction, PermissionFlagsBits, SlashCommandBuilder, GuildBan } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Ping the user to ban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(false)
                .addChoices(
                    {name: "Rule breaking", value: "Persitent rule violations"},
                    {name: "Racist", value: "Racism"}
                )),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const client = interaction.client;
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "No reason was provided";
        client.users.send(target.id, `You where banned for: ${reason}`);
        await interaction.reply(`Banned: ${target.username}#${target.discriminator}\nReason: ${reason}`);
        await interaction.guild.members.ban(target, { reason: reason }).catch(err => {return;});
	},
}