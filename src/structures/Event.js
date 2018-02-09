class Event {
	constructor(client, options = {}) {
		this.client = client;
		this.name = options.name;
		this.type = 'event';
		this.enabled = Boolean(options.enabled);
	}

	async _run(...args) {
		if (this.enabled) {
			try {
				await this.run(...args);
			} catch (error) {
				this.client.emit('error', this, args, error);
			}
		}
	}

	run() {}
}

module.exports = Event;
