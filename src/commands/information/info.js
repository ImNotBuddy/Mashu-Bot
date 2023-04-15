const { EmbedBuilder, Interaction, SlashCommandBuilder } = require("discord.js");

const { ownerID } = require("../../configs/bot-config.json");

const axios = require("axios");
require("dotenv/config");

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
        .setName("info")
        .setDescription("Replies with information")
        .addSubcommand(subcommand =>
            subcommand.setName("bot")
                .setDescription("Replies with bot information"))
        .addSubcommand(subcommand =>
            subcommand.setName("user")
                .setDescription("Replies with information about a desired user who is *in* the server")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Ping a user for their info or don't for your information")))
        .addSubcommand(subcommand =>
            subcommand.setName("lookup")
                .setDescription("Replies with information about a user *outside* of the server")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("Ping a user for their info")
                        .setRequired(true))),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "bot") {

            await interaction.deferReply();
            const reply = await interaction.fetchReply();
            const latency = reply.createdTimestamp - interaction.createdTimestamp;

            const { default: prettyMs } = await import("pretty-ms")

            const client = interaction.client;
            const botOwner = await client.users.fetch(ownerID)

            const infoEmbed = new EmbedBuilder()
                .setColor("Purple")
                .setThumbnail(client.user.avatarURL())
                .setTitle(`${client.user.username}`)
                .setDescription("Some information about me")
                .addFields(

                    { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
                    { name: "Users", value: `${client.users.cache.size}`, inline: true },
                    { name: "Client ID", value: `${client.user.id}`, inline: true },

                    { name: "Uptime", value: `${prettyMs(client.uptime)}`, inline: true },
                    { name: "Latency", value: `${latency}ms`, inline: true },
                    { name: "Websocket Ping", value: `${client.ws.ping}ms`, inline: true },

                    { name: "Birthday", value: "My birthday is the 12th April" },
                    { name: "Where does my name come from?", value: "My creator is a massive Fate fan and I am aswell" },
                    { name: "My Hobbies", value: "I like helping others and cuddling Fou" }
                )
                .setFooter({ text: `Created by ${botOwner.username}#${botOwner.discriminator}`, iconURL: `${botOwner.avatarURL()}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [infoEmbed] });
        } else if (subcommand === "user") {
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

            } catch (error) {
                await interaction.reply("Not a valid user. They may not exist or are not in the server. Use `/info lookup` to search for a user outside of the guild");
            }
        } else if (subcommand === "lookup") {
            const target = interaction.options.getUser("target");
            const inGuild = interaction.guild.members.cache.get(target.id);

            if (inGuild) {
                await interaction.reply("That user is inside the server. Use `/info user` instead");
                return;
            }

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
        } else {
            return;
        }
    }
}