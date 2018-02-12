const { Command } = require('strelitzia');

class Volume extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			description: 'This is a simple volume command.'
		});
	}

	async run(message, args) {
		args = args.split(' ');
		this.client.lavalink.publish('volume', {
			guild: args[0],
			volume: args[1]
		});
		await this.client.rest.channels[message.channel_id].messages.create({ content: `Setting volume to ${args[1]}` });
	}
}

module.exports = Volume;
