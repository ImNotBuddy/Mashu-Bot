const { EmbedBuilder, Events } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const welcomeMessage = require("../../schemas/welcomeMessage");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const data = await welcomeMessage.findOne({ guildID: member.guild.id });
        if (!data) {
            return;
        }

        const channel = member.guild.channels.cache.get(data.channel);

        data.title = data.title.replaceAll("[user]", `${member}`).replaceAll("[serverName]", `${member.guild.name}`);
        data.description = data.description.replaceAll("[user]", `${member}`).replaceAll("[serverName]", `${member.guild.name}`);

        const welcomeEmbed = new EmbedBuilder()
            .setColor(data.color)
            .setTitle(data.title)
            .setDescription(data.description)
            .setImage(data.image);

        channel.send({ embeds: [welcomeEmbed] })
	}
}