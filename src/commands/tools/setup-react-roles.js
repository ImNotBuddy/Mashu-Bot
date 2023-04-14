const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, SlashCommandBuilder } = require("discord.js");

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup-react-roles")
		.setDescription("Setup react roles"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {

		await interaction.deferReply();
		const setupMessage = await interaction.channel.send("Setup is now in progress");
		
		const filter = (message) => {
			return message.author.id === interaction.user.id;
		};

		const helpMessage = await interaction.channel.send("Please type what text you want to be shown above the buttons");
		let mainMessage = "";

		await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
		.then(collected => {
			mainMessage = collected.first();
		})
		.catch(collected => {
			interaction.editReply("Setup exited, time ran out.");
			return;
		});

		const roleHelpMessage = await interaction.channel.send("Please **ping all the role** or enter the **role IDs** seperated by a space");

		await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
		.then (collected => {
			const content = collected.first().content;
			
			const roleIDs = content.replace(/</g, "").replace(/@/g, "").replace(/&/g, "").replace(/>/g, "").split(" ");

			for (const item of roleIDs) {
				const role = interaction.guild.roles.cache.get(item);
				if (!role) {
					interaction.editReply("Please enter a valid role");
					return
				}
			}

			const totalRows = Math.ceil(roleIDs.length/5);

			if (totalRows > 5) {
				interaction.editReply("You can only have up to 25 roles");
			}

			const rows = [];

			for (let i = 1; i < (totalRows + 1); i++) {
				const row = new ActionRowBuilder();
				rows.push(row);
				for (let i2 = (i-1)*5; i2 < (i*5); i2++) {
					
					const role = roleIDs[(i2)];

					if (!role) {
						break;
					}

					const label = capitalize(interaction.guild.roles.cache.get(role).name);
					row.components.push(
						new ButtonBuilder().setCustomId(role).setLabel(label).setStyle(ButtonStyle.Primary)
					)
				}
			}

			interaction.channel.send({
				content: mainMessage.content,
				components: rows
			})

			interaction.channel.messages.delete(collected.first().id);
			setupMessage.delete();
			helpMessage.delete();
			interaction.channel.messages.delete(mainMessage.id);
			roleHelpMessage.delete();
			interaction.deleteReply();

		})
		.catch(collected => {
			interaction.editReply("Setup exited, time ran out.");
		});
	}
}