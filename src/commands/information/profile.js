const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Get the avatar or banner of a user, in or outside of the server")
        .addSubcommand(subcommand =>
            subcommand.setName("avatar")
                .setDescription("Get the avatar of a user, in or outside of the server")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("User whose avatar you want. Use ID (if outside of the server) or ping. Leave blank for yours")
                        .setRequired(false)))

        .addSubcommand(subcommand =>
            subcommand.setName("banner")
                .setDescription("Get the banner of a user, in or outside of the server")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("User whose avatar you want. Use ID (if outside of the server) or ping. Leave blank for yours")
                        .setRequired(false)))
    ,


    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getUser("target") || interaction.user;
        const URL = `https://discord.com/api/users/${target.id}`;
        const token = process.env.DISCORD_API_TOKEN;

        if (subcommand === "avatar") {
            try {
                const response = await axios.get(URL, { headers: { Authorization: `Bot ${token}` } });

                if (response.status != 200) {
                    await interaction.reply("An unexpected error occured when trying to get that users profile picture.")
                }

                if (!response.data.avatar) {
                    await interaction.reply({ content: "This user does not have a valid avatar." });
                    return;
                }

                const format = response.data.avatar.startsWith("a_") ? "gif" : "webp";

                const avatar = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.${format}?size=4096`;
                const avatarPNG = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.jpg?size=4096`;
                const avatarJPG = `https://cdn.discordapp.com/avatars/${target.id}/${response.data.avatar}.png?size=4096`;

                const avatarEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`Avatar for ${target.username}`)
                    .setImage(avatar)
                    .setTimestamp();

                if (format === "gif") {
                    avatarEmbed.setDescription(`Direct Link: [gif](${avatar})`)
                } else {
                    avatarEmbed.setDescription(`Direct Links: [WebP](${avatar}) | [PNG](${`${avatarPNG}`}) | [JPG](${`${avatarJPG}`})`)
                }

                await interaction.reply({ embeds: [avatarEmbed] });

            } catch (error) {
                await interaction.reply("An unexpected error occured when trying to get that users avatar.");
            }
        } else if (subcommand === "banner") {
            try {
                const response = await axios.get(URL, { headers: { Authorization: `Bot ${token}` } });

                if (response.status != 200) {
                    await interaction.reply("An unexpected error occured when trying to get that users banner.")
                }

                if (!response.data.banner) {
                    await interaction.reply({ content: "This user does not have an custom banner." });
                    return;
                }

                const format = response.data.banner.startsWith("a_") ? "gif" : "webp";

                const banner = `https://cdn.discordapp.com/banners/${target.id}/${response.data.banner}.${format}?size=4096`;
                const bannerPNG = `https://cdn.discordapp.com/banners/${target.id}/${response.data.banner}.png?size=4096`;
                const bannerJPG = `https://cdn.discordapp.com/banners/${target.id}/${response.data.banner}.jpg?size=4096`;


                const bannerEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`Banner for ${target.username}`)
                    .setImage(banner)
                    .setTimestamp();

                if (format === "gif") {
                    bannerEmbed.setDescription(`Direct Link: [GIF](${banner})`)
                } else {
                    bannerEmbed.setDescription(`Direct Links: [WebP](${banner}) | [PNG](${`${bannerPNG}`}) | [JPG](${`${bannerJPG}`})`)
                }

                await interaction.reply({ embeds: [bannerEmbed] });

            } catch (error) {
                console.log(error.message);
                await interaction.reply("An unexpected error occured when trying to get that users banner.");
            }
        } else {
            return;
        }
    }
}