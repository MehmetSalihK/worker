const { Command } = require('strelitzia');

class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			description: 'This is a simple leave command.',
			group: 'music',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message) {
		const voiceChannel = await this.client.cache.guilds.get(message.guild_id).voiceStates.get(message.author.id);
		const ownVoiceChannel = await this.client.cache.guilds.get(message.guild_id).voiceStates.get(this.client.id);
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
		await this.client.redis.del(`tracklist:${message.guild_id}`);
		await this.client.publisher.publish('discord:VOICE_STATE_UPDATE', {
			op: 4,
			d: {
				guild_id: message.guild_id,
				channel_id: null,
				self_mute: false,
				self_deaf: false
			}
		}, { expiration: '60000' });
		await this.client.rest.channels[message.channel_id].messages.create({ content: 'Bye!' });
	}
}

module.exports = Leave;
