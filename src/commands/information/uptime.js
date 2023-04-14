const { Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("View the bot's uptime"),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const client = interaction.client;

        function generateReadyTimestamp() {
            return `<t:${Math.floor(client.readyAt / 1000)}:R>`;
        }

        await interaction.reply(`Running since : ${generateReadyTimestamp()}`);
    }
}