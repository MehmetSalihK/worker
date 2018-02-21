const { Strelitzia } = require('strelitzia');
const { join } = require('path');

process.on('unhandledRejection', console.error);

const client = new Strelitzia({
	token: process.env.DISCORD_TOKEN,
	prefix: '=',
	id: '411778853153800202',
	cache: true,
	weebsh: true
});

client.registry.registerGroups([
	['anime', 'Anime'],
	['music', 'Music'],
	['util', 'Util']
]);
client.registry.registerCommandsIn(join(__dirname, 'commands'));
client.registry.registerEventsIn(join(__dirname, 'events'));

client.on('error', console.error);

client.login(process.env.RABBITMQ, ['discord:MESSAGE_CREATE', 'discord:GUILD_CREATE', 'lavalink:END']);

// Only for debugging purposes
global.strelitzia = client;
