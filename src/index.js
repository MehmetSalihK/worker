const { Strelitzia } = require('strelitzia');
const { join } = require('path');

process.on('unhandledRejection', console.error);

const client = new Strelitzia({
	token: process.env.DISCORD_TOKEN,
	prefix: '=',
	id: '411778853153800202'
});

client.registry.registerCommandsIn(join(__dirname, 'commands'));
client.registry.registerEventsIn(join(__dirname, 'events'));

client.on('error', console.error);

client.login('localhost', ['MESSAGE_CREATE']);

// Only for debugging purposes
global.strelitzia = client;
