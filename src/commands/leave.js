const { Command } = require('strelitzia');

class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			description: 'This is a simple leave command.'
		});
	}

	async run(message, args) {
		args = args.split(' ');
		this.client.publisher.publish('VOICE_STATE_UPDATE', {
			op: 4,
			d: {
				guild_id: args[0],
				channel_id: null,
				self_mute: false,
				self_deaf: false
			}
		});
		await this.client.rest.channels[message.channel_id].messages.create({ content: 'Bye!' });
	}
}

module.exports = Leave;
