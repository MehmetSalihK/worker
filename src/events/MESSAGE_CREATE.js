const { Event } = require('strelitzia');

class MESSAGE_CREATE extends Event {
	constructor(...args) {
		super(...args, { name: 'MESSAGE_CREATE', enabled: true });
	}

	run(message, ack) {
		ack();
		const messageError = err => this.client.emit('error', err);
		this.client.dispatcher.handleMessage(message).catch(messageError);
	}
}

module.exports = MESSAGE_CREATE;
