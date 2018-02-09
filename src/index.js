const ZeroTwoWorkerClient = require('./structures/Client');
const { join } = require('path');

const client = new ZeroTwoWorkerClient({
	token: process.env.DISCORD_TOKEN,
	eventPath: join(__dirname, 'events')
});

client.login('localhost', ['MESSAGE_CREATE']);
