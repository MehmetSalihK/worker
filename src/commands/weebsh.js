const { Command } = require('strelitzia');

const WEEB_SH_TYPES = [
	'awoo',
	'bang',
	'blush',
	'clagwimoth',
	'cry',
	'cuddle',
	'dance',
	'hug',
	'insult',
	'jojo',
	'kiss',
	'lewd',
	'lick',
	'megumin',
	'neko',
	'nom',
	'owo',
	'pat',
	'poke',
	'pout',
	'rem',
	'shrug',
	'slap',
	'sleepy',
	'smile',
	'teehee',
	'smug',
	'stare',
	'thumbsup',
	'triggered',
	'wag',
	'waifu_insult',
	'wasted',
	'sumfuk',
	'dab',
	'tickle',
	'highfive',
	'banghead',
	'bite',
	'discord_memes',
	'nani',
	'initial_d',
	'delet_this',
	'poi',
	'thinking',
	'greet',
	'punch',
	'handholding',
	'kemonomimi',
	'trap'
];

class WeebSH extends Command {
	constructor(client) {
		super(client, {
			name: 'weebsh',
			description: 'This is a simple weebsh command.',
			group: 'anime',
			format: '<query>',
			throttling: {
				usages: 2,
				duration: 5
			}
		});
	}

	async run(message, args) {
		if (!WEEB_SH_TYPES.includes(args[0])) return;
		const { data } = await this.client.weebsh.get(`/images/random?type=${args[0]}`);
		await this.client.rest.channels[message.channel_id].messages.create({
			embed: {
				image: { url: data.url },
				footer: { text: 'Powered by weeb.sh' }
			}
		});
	}
}

module.exports = WeebSH;
