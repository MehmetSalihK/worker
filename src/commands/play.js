const { Command } = require('strelitzia');
const axios = require('axios');

class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			description: 'This is a simple play command.'
		});

		this.axios = axios.create({
			baseURL: `http://${process.env.GATEWAY}:2333`,
			headers: { common: { Authorization: process.env.PASSWORD } }
		});
	}

	async run(message, args) {
		args = args.split(' ');
		try {
			var { data } = await this.axios.get(`/loadtracks?identifier=${args[0]}`);
		} catch (error) {
			await this.client.rest.channels[message.channel_id].messages.create({ content: 'Whatever you did, it didn\'t work.' });
		}
		if (!data.length || !data) await this.client.rest.channels[message.channel_id].messages.create({ content: 'Couldn\'t find a track.' });
		this.client.lavalink.publish('play', {
			guild: args[1],
			track: data[0].track
		});
		await this.client.rest.channels[message.channel_id].messages.create({ content: `Now playing: ${data[0].info.title}` });
	}
}

module.exports = Play;
