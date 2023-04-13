const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, SlashCommandBuilder } = require("discord.js");

const roles = [
    {
        id: "1096095500882690088",
        label: "Red"
    },
    {
        id: "1096095546546081912",
        label: "Green"
    },
    {
        id: "1096095576610836510",
        label: "Yellow"
    },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactroles")
        .setDescription("Creates a message where you can react for roles"),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const client = interaction.client;
        const channel = await client.channels.cache.get("1095731466924732557");

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        });

        await channel.send({
            content: "Claim roles below",
            components: [row]
        })

        await interaction.reply({ content: "Created message", ephemeral: true })
    },
}