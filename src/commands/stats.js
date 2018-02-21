const { Command } = require('strelitzia');

class Stats extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			description: 'This is a simple stats command.',
			group: 'util',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		const { heap } = await this.client.rpc.publish('stats:PROCESS', 'test', { expiration: '60000' });
		const guilds = await this.client.cache.guilds.size();
		const channels = await this.client.cache.channels.size();
		const localHeap = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
		await this.client.rest.channels[message.channel_id].messages.create({
			embed: {
				author: { name: `${this.client.me.username} Statistics` },
				fields: [
					{
						name: 'Memory Usage (Gateway)',
						value: `${heap}MB`,
						inline: true
					},
					{
						name: 'Memory Usage (Worker)',
						value: `${localHeap}MB`,
						inline: true
					},
					{
						name: 'Guilds',
						value: guilds,
						inline: true
					},
					{
						name: 'Channels',
						value: channels,
						inline: true
					}
				],
				thumbnail: { url: `https://cdn.discordapp.com/avatars/${this.client.me.id}/${this.client.me.avatar}.webp` }
			}
		});
	}
}

module.exports = Stats;
