const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banner")
        .setDescription("Get the image of a user's banner, in or outside of the server")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("User whose banner you want, use ID (if not in the server) or ping. Leave blank for yours")
                .setRequired(false)),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const target = interaction.options.getUser("target") ?? interaction.user;
        const URL = `https://discord.com/api/users/${target.id}`;
        const token = process.env.DISCORD_API_TOKEN;

        try {
            const response = await axios.get(URL, { headers: { Authorization: `Bot ${token}` } });

            if (response.status != 200) {
                await interaction.reply("An unexpected error occured when trying to get that users banner.")
            }

            if (!response.data.banner) {
                await interaction.reply({ content: "This user does not have an image banner." });
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
                bannerEmbed.setDescription(`Direct Link: [gif](${banner})`)
            } else {
                bannerEmbed.setDescription(`Direct Links: [WebP](${banner}) | [PNG](${`${bannerPNG}`}) | [JPG](${`${bannerJPG}`})`)
            }

            await interaction.reply({ embeds: [bannerEmbed] });

        } catch(error) {
            console.log(error.message);
            await interaction.reply("An unexpected error occured when trying to get that users banner.");
        }
    }
}