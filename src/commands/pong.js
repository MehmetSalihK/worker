const { SubCommand } = require('strelitzia');

class Pong extends SubCommand {
	constructor(client) {
		super(client, {
			name: 'pong',
			description: 'This is a simple ping command.',
			parent: 'ping'
		});
	}

	async run(message) {
		await this.client.rest.channels[message.channel_id].messages.create({ content: 'pingpongping!' });
	}
}

module.exports = Pong;
