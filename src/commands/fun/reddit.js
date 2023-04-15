const { Interaction, SlashCommandBuilder } = require("discord.js");
const justreddit  = require("justreddit");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reddit")
		.setDescription("Post a random image from a subreddit. The 'r/' and spaces are optional")
        .addStringOption(option => 
            option.setName("subreddit")
                .setDescription("Subreddit to get the image from")
                .setRequired(true)),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const subreddit = interaction.options.getString("subreddit").replaceAll("r/", "").replaceAll(" ", "");
        await interaction.deferReply();
        
        try {
            const post = await justreddit.randomImageFromSub({ subReddit: subreddit, sortType: "hot" });
            if (post === "https://via.placeholder.com/150" || !post) {
                await interaction.editReply(`The subreddit \`${subreddit}\` was not found/ did not have any images.`);
                return;
            }
		    await interaction.editReply(`Image from: \`r/${subreddit}\`\n${post}`);
        } catch (error) {
            await interaction.editReply(`The subreddit ${subreddit} was not found/ did not have any images.`);
        }
	}
}