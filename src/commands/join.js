const { Command } = require('strelitzia');

class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			description: 'This is a simple join command.'
		});
	}

	async run(message, args) {
		args = args.split(' ');
		this.client.publisher.publish('VOICE_STATE_UPDATE', {
			op: 4,
			d: {
				guild_id: args[0],
				channel_id: args[1],
				self_mute: false,
				self_deaf: false
			}
		});
		await this.client.rest.channels[message.channel_id].messages.create({ content: 'Hi!' });
	}
}

module.exports = Join;
