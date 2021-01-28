const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

bot.once('ready', () => {
	console.log('Map-Bot Logged In And Ready!');
})

bot.on('message', message => {
	console.log('LOG: New Message: ' + message.content);

	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	//ignore non-prefixed messages or messages coming from bots

	const args = message.content.slice(config.prefix.length).trim().split('/ +/');
	const command = args.shift().toLowerCase();

	if (command == 'args-info') {
		message.channel.send('Command Name: ' + command + ', Arguments: [' + args + ']');
	}
})

bot.login(config.token);