# Mashu-Bot ReadMe

# Powered by [Discord.js V14](https://discord.js.org/#/)

## Features
  1. The bot does not hard code specific-variables such as bot name or bot profile pricture. This means very little editing is needed. The only file that may        need to be edited is ```src/commands/information/botInfo.js```. This is because I just wanted to give my bot some personality, change it or delete it.
  2. The bot uses the cool new [Slash Commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ)
  3. Dynamic "/help" command that you will never need to update. It uses other commands slash command data to build itself


## Requirements
  1. A basic understanding of Javascript
  2. Node.js installed on your machine (computer)

## Setup
  1. To set the bot up first create a file called '.env'  (it should **NOT** be under the 'src' folder
  2. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
  3. Create a new application or use an old one (a new one is recommended)
      3.5. Create a bot under the application if you need to. 
  4. Copy the bot's token, do not share this with anyone
      4.5. Invite the bot to your server. You can do this by pressing 'OAuth2' then 'URL Generator'. Next press the buttons ```bot``` and ```applications.commands```. Then under 'Bot Permissions' press admin or, if you have reviewed the source code press the ones you know apply.
  5. Go into the '.env' file and paste the line ```DISCORD_API_TOKEN=YOUR-TOKEN```. Replace 'YOUR-TOKEN' with the token you copied
  6. Go into 'config.json' and change 'clientID' to the bot's ID and 'guildID' to the servers ID. [Guide (not from me)](https://www.youtube.com/watch?v=NLWtSHWKbAI)
  7. Run ```node deploy-commands.js```. This registers the slash commands to the guild specified with the ID in 'config.json'. View the [Discord.js Docs](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration) for further info
  8. Open the code in VSCode or an editor and use ```node .``` to run the bot
  9. Type slash in a channel to access commands

