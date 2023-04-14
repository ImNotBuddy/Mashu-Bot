const { Events, Interaction } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,

	/**
	 * 
	 * @param {Interaction} interaction 
	 * @returns 
	 */

	async execute(interaction) {

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
			try {
				await interaction.deferReply({ ephemeral: true });

				const role = interaction.guild.roles.cache.get(interaction.customId);
				if (!role) {
					interaction.editReply({
						content: "Could not find that role. Contact the server owner or admin as the role may have been deleted accidentally.",
					});
					return;
				}

				const hasRole = interaction.member.roles.cache.has(role.id);
				if (hasRole) {
					await interaction.member.roles.remove(role);
					await interaction.editReply(`The role ${role} was removed`);
				} else {
					await interaction.member.roles.add(role);
					await interaction.editReply(`The role ${role} was added`);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			return;
		}
	}
}