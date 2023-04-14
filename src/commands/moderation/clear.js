const { Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clear an amount of messages between 1-100 in a channel")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount of messages to clear (1-100)")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),

    /**
     * 
     * @param {Interaction} interaction 
     */

	async execute(interaction) {
        const client = interaction.client;

        const messageChannel = interaction.channel;
        const deleteAmount = interaction.options.getInteger("amount");

        if (deleteAmount < 1 || 100 < deleteAmount) {
            await interaction.reply({ content: "Amount must be greater than 0 and less than 100.", ephemeral: true }); 
            return;
        }

        messageChannel.bulkDelete(deleteAmount)
        .then(interaction.reply({ content: `Clearing ${deleteAmount} message(s).`, ephemeral: true }))
        .catch(err => {
            interaction.reply({ content: "There was an error executing that command.", ephemeral: true });
            return;
        });
	}
}