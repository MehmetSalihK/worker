const { EventEmitter } = require('events');
const rest = require('@spectacles/rest');
const { Amqp } = require('@spectacles/brokers');
const { readdirSync } = require('fs');
const { join } = require('path');

class ZeroTwoWorkerClient extends EventEmitter {
	constructor(options = {}) {
		super();
		this.rest = rest(options.token);
		this.eventPath = options.eventPath;
		this.consumer = new Amqp('consumer');
	}

	async login(url = 'localhost', events) {
		try {
			await this.consumer.connect(url);

			await this.consumer.subscribe(events);

			const files = readdirSync(this.eventPath);
			for (let event of files) {
				event = require(join(this.eventPath, event));
				if (typeof event === 'function') event = new event(this);
				if (event.enabled) this.consumer.on(event.name, event._run.bind(event));
			}
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = ZeroTwoWorkerClient;
