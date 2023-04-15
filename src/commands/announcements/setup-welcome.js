const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

const chalk = require("chalk");

const welcomeMessage = require("../../schemas/welcomeMessage");

function isValidHexColor(str) {
	return /^([0-9A-F]{3}){1,2}$/i.test(str);
}

function isUrl(str) {
	// Regular expression pattern for matching URLs
	const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
	
	// Return true if the string matches the URL pattern, false otherwise
	return urlPattern.test(str);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup-welcome")
		.setDescription("Setup for the welcome message"),

	/**
	 * 
	 * @param {Interaction} interaction 
	 */

	async execute(interaction) {
		await interaction.reply("Setup is now in progress. Each time you are required to respond there is a 15 second time limit.\nSome advanced functions:\n`[user]` --> Ping the user who just joined. Does not work in the embed title, it will just display `<@userID>`\n`[serverName] --> Name of the server. Works in all sections.`");

		const filter = (message) => {
			return message.author.id === interaction.user.id;
		};

		try {
			const titleMessage = await interaction.channel.send("Please send the content you want displayed as the embed title.");
			const title = (await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })).first();

			const descriptionMessage = await interaction.channel.send("Please send the content you want displayed inside of the embed.");
			const description = (await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })).first();

			const colorMessage = await interaction.channel.send("Please send the color of the embed as a hex color **(do not include the `#`)**");
			const color = (await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })).first();

			if (!isValidHexColor(color.content)) {
				interaction.deleteReply();
				await interaction.channel.send("Not a valid hex code! Please try again as setup has been exited.");
				return;
			}

			const imageMessage = await interaction.channel.send("Please send a link to the image/ gif for the embed");
			const image = (await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })).first();

			if (!isUrl(image.content)) {
				interaction.deleteReply();
				await interaction.channel.send("Not a valid URL! Please try again as setup has been exited.");
				return;
			}

			const channelMessage = await interaction.channel.send("Please send the ID of the channel in which you want the Welcome message to be sent.");
			const channel = (await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })).first().content.replace(/</g, "").replace(/#/g, "").replace(/>/g, "");
			
			const channelObj = interaction.guild.channels.cache.get(channel);

			if (!channelObj) {
				interaction.deleteReply();
				await interaction.channel.send("Not a valid channel! Please try again as setup has been exited.");
				return;
			}

			let data = await welcomeMessage.findOne({ guildID: interaction.guild.id });

			if (!data) {
				data = await new welcomeMessage({
					guildID: interaction.guild.id,
					channel: channel,
					color: "#" + color.content,
					title: title.content,
					description: description.content,
					image: image.content
				});
				await data.save().then(async welcomeMessage => {console.log(chalk.green(`[Data Created] GuildID: ${welcomeMessage.guildID}`))}).catch(console.error);
			} else {
				data = {
					guildID: interaction.guild.id,
					channel: channel,
					color: "#" + color.content,
					title: title.content,
					description: description.content,
					image: image.content
				};
				await welcomeMessage.findOneAndUpdate({ guildID: interaction.guild.id }, data);
			}

			const embed = new EmbedBuilder()
				.setColor(data.color)
				.setTitle(data.title.replaceAll("[user]", `${interaction.user}`).replaceAll("[serverName]", `${interaction.guild.name}`))
				.setDescription(data.description.replaceAll("[user]", `${interaction.user}`).replaceAll("[serverName]", `${interaction.guild.name}`))
				.setImage(data.image);

			await interaction.channel.send({ content:"Here is a preview of the embed!", embeds: [embed] });
		} catch (error) {
			console.log(error);
		}
	}
}