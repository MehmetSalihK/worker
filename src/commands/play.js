const { Command } = require('strelitzia');
const axios = require('axios');

class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: 'This is a simple play command.',
			group: 'music',
			throttling: {
				usages: 2,
				duration: 3
			}
		});

		this.axios = axios.create({
			baseURL: `http://${process.env.HTTP}`,
			headers: { common: { Authorization: process.env.PASSWORD } }
		});
	}

	async run(message, args) {
		const channel = await this.client.cache.channels.get(message.channel_id);
		const voiceChannel = await this.client.cache.guilds.get(channel.guild_id).voiceStates.get(message.author.id);
		const ownVoiceChannel = await this.client.cache.guilds.get(channel.guild_id).voiceStates.get(this.client.id);
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
		try {
			var { data } = await this.axios.get(`/loadtracks?identifier=${args[0].replace(/<(.+)>/g, '$1')}`);
		} catch (error) {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'Whatever you did, it didn\'t work.' });
			return;
		}
		if (!data.length || !data) {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'Couldn\'t find a track.' });
			return;
		}
		const songs = await this.client.redis.llen(`tracklist:${channel.guild_id}`);
		if (!songs) {
			await this.client.redis.rpush(`tracklist:${channel.guild_id}`, JSON.stringify(data[0]));
			await this.client.publisher.publish('lavalink:PLAY', {
				guild: channel.guild_id,
				track: data[0].track
			}, { expiration: '60000' });
			await this.client.rest.channels[message.channel_id].messages.create({ content: `Now playing: ${data[0].info.title}` });
		} else {
			await this.client.redis.rpush(`tracklist:${channel.guild_id}`, JSON.stringify(data[0]));
			await this.client.rest.channels[message.channel_id].messages.create({ content: `Queued up: ${data[0].info.title}` });
		}
	}
}

module.exports = Play;
