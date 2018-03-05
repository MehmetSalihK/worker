const { Command } = require('strelitzia');
const unindent = require('../unindent');
const paginate = require('../paginate');

class Queue extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			description: 'This is a simple queue command.',
			group: 'music',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message, args) {
		const songsLength = await this.client.redis.llen(`tracklist:${message.guild_id}`);
		if (!songsLength) return this.client.rest.channels[message.channel_id].messages.create({ content: 'Nothing in queue.' });
		const rawQueue = await this.client.redis.lrange(`tracklist:${message.guild_id}`, 0, -1);
		const songs = [];
		for (const song of rawQueue) songs.push(JSON.parse(song));
		const totalLength = songs.reduce((prev, song) => prev + song.info.length, 0);
		const paginated = paginate(songs, args[0]);
		return this.client.rest.channels[message.channel_id].messages.create({
			embed: {
				author: {
					name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
					icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`
				},
				description: unindent`
					**Song queue, page ${paginated.page}**
					${paginated.items.map(song => `**-** [${song.info.title}](${song.info.uri}) (${this.timeString(song.info.length)})`).join('\n')}
					${paginated.maxPage > 1 ? `\nUse =queue <page> to view a specific page.\n` : ''}

					**Now playing:** [${paginated.items[0].info.title}](${paginated.items[0].info.uri})

					**Total queue time:** ${this.timeString(totalLength)}
				`
			}
		});
	}

	timeString(seconds, forceHours = false, ms = true) {
		if (ms) seconds /= 1000;
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor(seconds % 3600 / 60);

		return `${forceHours || hours >= 1 ? `${hours}:` : ''}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
	}
}

module.exports = Queue;
