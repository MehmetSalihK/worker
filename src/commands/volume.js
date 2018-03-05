const { Command } = require('strelitzia');

class Volume extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			description: 'This is a simple volume command.',
			group: 'music',
			format: '<volume>',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message, args) {
		const voiceChannel = await this.client.cache.guilds.get(message.guild_id).voiceStates.get(message.author.id);
		const ownVoiceChannel = await this.client.cache.guilds.get(message.guild_id).voiceStates.get(this.client.id);
		if (ownVoiceChannel && ownVoiceChannel.channel_id === 'null') {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'I\'m not in a voice channel.' });
			return;
		}
		if (voiceChannel) {
			if (voiceChannel.channel_id === 'null') {
				await this.client.rest.channels[message.channel_id].messages.create({ content: 'You aren\'t in a voice channel!' });
				return;
			}
			if (ownVoiceChannel) {
				if (ownVoiceChannel.channel_id !== 'null' && voiceChannel.channel_id !== ownVoiceChannel.channel_id) {
					await this.client.rest.channels[message.channel_id].messages.create({ content: 'Don\'t event try.' });
					return;
				}
			}
		}
		await this.client.publisher.publish('lavalink:VOLUME', {
			guild: message.guild_id,
			volume: args[0]
		}, { expiration: '60000' });
		await this.client.rest.channels[message.channel_id].messages.create({ content: `Setting volume to ${args[0]}` });
	}
}

module.exports = Volume;
