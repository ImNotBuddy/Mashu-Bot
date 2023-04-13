const { Interaction, SlashCommandBuilder } = require("discord.js");
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
                await interaction.reply("An unexpected error occured when trying to get that users banner")
            }

            let banner = response.data.banner;

            if (banner) {
                const format = banner.startsWith("a_") ? "gif" : "webp";
                banner = `https://cdn.discordapp.com/banners/${target.id}/${banner}.${format}?size=4096`;
                await interaction.reply({ content: banner, ephemeral: false });
            } else {
                await interaction.reply({ content: "This user does not have an image banner" });
            }
        } catch (error) {
            await interaction.reply("An unexpected error occured when trying to get that users banner");
        }
    }
}