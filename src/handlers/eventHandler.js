const { connection } = require("mongoose");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async (client) => {
    const foldersPath = path.join(__dirname, "../events");
    const eventFolders = fs.readdirSync(foldersPath);

    for (const folder of eventFolders) {
        const eventsPath = path.join(foldersPath, folder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);

            switch (folder) {
                case "client":
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args));
                    }

                case "mongoDB":
                    if (event.once) {
                        connection.once(event.name, (...args) => event.execute(...args));
                    } else {
                        connection.on(event.name, (...args) => event.execute(...args));
                    }
            }
        }
    }
}

//.filter(file => file.endsWith(".js"))