const { Command } = require('strelitzia');

const RESPONSES = [
	'No.',
	'Maybe later.',
	'Not happening.',
	'Try again later.',
	'Nice try.',
	':ping_pong: Pong! `$(ping)`ms',
	'I-it\'s not like I wanted to pong! `$(ping)`ms',
	'D-don\'t think this means anything special! `$(ping)`ms'
];

class Ping extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			description: 'This is a simple ping command.',
			group: 'util',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		const msg = await this.client.rest.channels[message.channel_id].messages.create({ content: 'pong!' });
		await this.client.rest.channels[msg.channel_id].messages[msg.id].edit({
			content: RESPONSES[Math.floor(Math.random() * RESPONSES.length)]
				.replace('$(ping)', Math.ceil(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()))
		});
	}
}

module.exports = Ping;
