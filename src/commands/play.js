const { Command } = require('strelitzia');
const axios = require('axios');
const { URL } = require('url');

class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: 'This is a simple play command.',
			group: 'music',
			format: '<query>',
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
		args = args.join(' ');
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
		if (!ownVoiceChannel || ownVoiceChannel.channel_id === 'null') {
			await this.client.publisher.publish('discord:VOICE_STATE_UPDATE', {
				op: 4,
				d: {
					guild_id: message.guild_id,
					channel_id: voiceChannel.channel_id,
					self_mute: false,
					self_deaf: false
				}
			}, { expiration: '60000' });
		}

		try {
			try {
				const url = new URL(args.replace(/<(.+)>/g));
				var { data } = await this.axios.get(`/loadtracks?identifier=${url.href}`);
			} catch (error) {
				var { data } = await this.axios.get(`/loadtracks?identifier=ytsearch:${args.replace(/<(.+)>/g, '$1')}`);
			}
		} catch (error) {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'Whatever you did, it didn\'t work.' });
			return;
		}
		if (!data.length || !data) {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'Couldn\'t find a track.' });
			return;
		}
		const songs = await this.client.redis.llen(`tracklist:${message.guild_id}`);
		if (!songs) {
			await this.client.redis.rpush(`tracklist:${message.guild_id}`, JSON.stringify(data[0]));
			await this.client.publisher.publish('lavalink:PLAY', {
				guild: message.guild_id,
				track: data[0].track
			}, { expiration: '60000' });
			await this.client.rest.channels[message.channel_id].messages.create({ content: `Now playing: ${data[0].info.title}` });
		} else {
			await this.client.redis.rpush(`tracklist:${message.guild_id}`, JSON.stringify(data[0]));
			await this.client.rest.channels[message.channel_id].messages.create({ content: `Queued up: ${data[0].info.title}` });
		}
	}
}

module.exports = Play;
