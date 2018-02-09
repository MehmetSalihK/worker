const Event = require('../structures/Event');

class MESSAGE_CREATE extends Event {
	constructor(...args) {
		super(...args, { name: 'MESSAGE_CREATE', enabled: true });
	}

	run(message, ack) {
		ack();
		if (message.content === '!ping') {
			this.client.rest.channels[message.channel_id].messages.create({ content: 'pong!' });
		}
	}
}

module.exports = MESSAGE_CREATE;
