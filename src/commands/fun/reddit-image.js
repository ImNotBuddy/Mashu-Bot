const { Interaction, SlashCommandBuilder } = require("discord.js");
const justreddit  = require("justreddit");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reddit-image")
		.setDescription("Post a random reddit image from a desired subreddit")
        .addStringOption(option => 
            option.setName("subreddit")
                .setDescription("Subreddit to fetch an image from")
                .setRequired(true)),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
        const subreddit = interaction.options.getString("subreddit");
        await interaction.deferReply();
        
        try {
            const post = await justreddit.randomImageFromSub({ subReddit: subreddit, sortType: "hot" });
            if (post === "https://via.placeholder.com/150") {
                await interaction.editReply(`The subreddit \`${subreddit}\` was not found/ did not have any images.`);
                return;
            }
		    await interaction.editReply(post);
        } catch (error) {
            await interaction.editReply(`The subreddit ${subreddit} was not found/ did not have any images.`);
        }
	},
}