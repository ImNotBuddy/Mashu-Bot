const { ChannelType, EmbedBuilder, Interaction, Role, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Get server related information")
        .addSubcommand(subcommand =>
            subcommand.setName("info")
                .setDescription("Get server info"))
        .addSubcommand(subcommand =>
            subcommand.setName("icon")
                .setDescription("Get just the server icon"))
        .addSubcommand(subcommand =>
            subcommand.setName("banner")
                .setDescription("Get just the server banner")),

    /**
     * 
     * @param {Interaction} interaction 
     */

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        const guild = interaction.guild;
        const guildIcon = interaction.guild.iconURL()
        const guildBanner = interaction.guild.bannerURL()

        if (subcommand === "info") {
            const guildOwner = await guild.members.fetch(guild.ownerId);
            const infoEmbed = new EmbedBuilder()
                .setColor("Purple")
                .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                .setTitle("Server Information")
                .setDescription(`**Server Description**:\n${guild.description}`)
                .addFields(
                    { name: "Owner", value: `${guildOwner.user}`, inline: true },
                    { name: "Creation Date", value: `<t:${parseInt(guild.createdAt / 1000)}:R>`, inline: true },
                    { name: "Server ID", value: `${guild.id}`, inline: true },

                    { name: "Channels", value: `${guild.channels.cache.filter(channel => channel.type !== ChannelType.GuildCategory).size}`, inline: true },
                    { name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true },
                    { name: "Server Level", value: `${guild.premiumTier}`, inline: true },

                    { name: "Members", value: `${guild.memberCount}`, inline: true },
                    { name: "Custom Emojis", value: `${guild.emojis.cache.size}`, inline: true },
                    { name: "Total Roles", value: `${guild.roles.cache.filter(role => role.id !== guild.roles.everyone.id).size}`, inline: true },
                )
                .setTimestamp();

                if (guildIcon) {
                    infoEmbed.setThumbnail(guildIcon)
                }

                if (guildBanner) {
                    infoEmbed.setImage(guildBanner)
                }

            await interaction.reply({ embeds: [infoEmbed] });
        } else if (subcommand === "icon") {
            if (guildIcon) {
                await interaction.reply(guildIcon);
            } else {
                await interaction.reply("This server does not have an icon.");
            }
        } else if (subcommand === "banner") {
            if (guildBanner) {
                await interaction.reply(guildBanner);
            } else {
                await interaction.reply("This server does not have a banner.");
            }
        } else {
            return;
        }
    }
}