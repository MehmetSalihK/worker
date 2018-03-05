const { Command } = require('strelitzia');

class Clear extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			description: 'This is a simple clear command.',
			group: 'music',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		if (message.author.id !== '81440962496172032') return;
		await this.client.redis.del(`tracklist:${message.guild_id}`);
		await this.client.rest.channels[message.channel_id].messages.create({ content: `Cleared the queue.` });
	}
}

module.exports = Clear;
