const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

const axios = require("axios");
require("dotenv/config")

async function api_request(userID) {
    const URL = `https://discord.com/api/users/${userID}`;
    const token = process.env.DISCORD_API_TOKEN;
    const response = await axios.get(URL, { headers: { Authorization: `Bot ${token}` } });

    const epoch = 1420070400000;
    const timestamp = (BigInt(userID) >> 22n) + BigInt(epoch);
    const createdAt = new Date(Number(timestamp));
    response.data.accountCreatedAt = Math.floor(createdAt.getTime() / 1000);

    return response.data;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userlookup")
        .setDescription("Get user info about someone *outside* of the server")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("Ping a user for their info")
                .setRequired(true)),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {

        const target = interaction.options.getUser("target");

        try {
            await interaction.guild.members.fetch(target.id);
            await interaction.reply("That user is inside the server. Use `/userinfo` instead");
            return;
        } catch (error) {
            const user = await api_request(target.id);

            let avatar = user.avatar;
            if (avatar) {
				const format = avatar.startsWith("a_") ? "gif" : "webp";
				avatar = `https://cdn.discordapp.com/avatars/${target.id}/${avatar}.${format}?size=4096`;
			} else {
                await interaction.reply({ content: "This user does not have a valid avatar" });
                return;
            }

            const infoEmbed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle(`Information for the user: ${user.username}#${user.discriminator}`)
                .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.avatarURL()}` })
                .setThumbnail(avatar)
                .setDescription(`Some information about ${user.username}#${user.discriminator}`)
                .addFields(
                    { name: "Full Username", value: `${user.username}#${user.discriminator}` },
                    { name: "Joined Discord", value: `<t:${user.accountCreatedAt}:R>`, inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [infoEmbed] });
        }
    },
}