// Pretty much the code from the docs; a combination of the example command handler and registering commands code
const fs = require("node:fs");
const path = require("node:path");

// const { REST, Routes } = require("discord.js");
// const { clientID, guildID } = require("../config.json");

//const commands = [];

module.exports = async (client) => {
    const foldersPath  = path.join(__dirname, "../commands")
    const commandFolders = fs.readdirSync(foldersPath );

    for (const folder  of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) { // make sure the command has the necessary parameters
                client.commands.set(command.data.name, command); // set that bots commands using the command name and the command object
                //commands.push(command.data.toJSON()); // push the command data as a json to an array
            } else {
                console.log(`[WARNING] The command '${file}' has not been loaded due to missing a required "data" or "execute" property.`); // tell us the command was not setup right
            }
        }
    }

    // // PUSHING COMMAND TO THE GUILD
    // const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_API_TOKEN);

    // try {
    //      console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    //     // The put method is used to fully refresh all commands in the guild with the current set
    //     const data = await rest.put(
    //         Routes.applicationGuildCommands(ClientID, GuildID),
    //         { body: commands },
    //     );
    //      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    // } catch (error) {
    //      // And of course, make sure you catch and log any errors!
    //     console.error(error);
    // }
}