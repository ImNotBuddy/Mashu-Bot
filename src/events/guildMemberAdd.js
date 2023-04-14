const { EmbedBuilder, Events } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const welcomeConfigPath = path.join(__dirname, "../configs/welcome-config.json");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        let embedData = JSON.parse(fs.readFileSync(welcomeConfigPath).toString());;
        const channel = member.guild.channels.cache.get(embedData.Channel);

        embedData.Title = embedData.Title.replaceAll("[user]", `${member}`).replaceAll("[serverName]", `${member.guild.name}`);
        embedData.Description = embedData.Description.replaceAll("[user]", `${member}`).replaceAll("[serverName]", `${member.guild.name}`);

        const welcomeEmbed = new EmbedBuilder()
            .setColor(embedData.Color)
            .setTitle(embedData.Title)
            .setDescription(embedData.Description)
            .setImage(embedData.Image);

        channel.send({ embeds: [welcomeEmbed] })
	}
}