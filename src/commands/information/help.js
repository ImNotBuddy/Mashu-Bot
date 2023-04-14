const { Interaction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get command-related information"),

    /**
     * 
     * @param {Interaction} interaction 
     */

	async execute(interaction) {
        
        const client = interaction.client;
        const helpEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Mashu Help")
            .setURL("https://github.com/ImNotBuddy/Mashu-Bot")
            .setAuthor({ name: "Mashu", iconURL: client.user.avatarURL() })
            .setDescription("Need some help?")
            .setTimestamp()
            .setFooter({ text: "Join our discord for further help" });
        
        const fields = [];
        var commandDescriptions = {};

        const foldersPath  = path.join(__dirname, "../../commands");

        for (const command of client.commands) {
            commandDescriptions[command[1].data.name] = command[1].data.description;
        };

        fs.readdirSync(foldersPath).forEach(dir => {
            const commandNames = [];
            const commandsPath = path.join(foldersPath, dir);
            const commands = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
            
            for (const command of commands) {
                const commandName = command.replace(".js", "");
                commandNames.push(`**/${commandName}**: ${commandDescriptions[commandName]}`);
            }

            let field = { name: dir.toUpperCase(), value: commandNames.join("\n") };
            fields.push(field);
        });

        helpEmbed.addFields(fields);
		await interaction.reply({ embeds: [helpEmbed] });
	}
}