const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get user info about someone *inside* of the server")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Ping a user for their info or don't for your info")),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {

        const user = interaction.options.getUser("target") || interaction.user;
        try {
            const member = await interaction.guild.members.fetch(user.id);

            const infoEmbed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Information for the user")
                .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.avatarURL()}` })
                .setThumbnail(user.avatarURL())
                .setDescription(`Some information about ${user}`)
                .addFields(
                    { name: "Full Username", value: `${user.username}#${user.discriminator}` },
                    { name: "Roles", value: `${member.roles.cache.map(r => r).join(" ")}` },
                    { name: "Joined Server", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
                    { name: "Joined Discord", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [infoEmbed] });
            console.log(user.createdAt)
        } catch (error) {
            await interaction.reply("Not a valid user. They may not exist or are not in the server. Use `/userlookup` to search for a user outside of the guild");
        }
    },
}