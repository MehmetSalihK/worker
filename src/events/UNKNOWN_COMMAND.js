const { Event } = require('strelitzia');

class UNKNOWN_COMMAND extends Event {
	constructor(...args) {
		super(...args, { name: 'UNKNOWN_COMMAND', enabled: true, client: true });
	}

	run(message, args) {
		args = args.split(' ');
		const [cmd] = this.client.registry.findCommands('weebsh');
		if (cmd) cmd._run(message, args);
	}
}

module.exports = UNKNOWN_COMMAND;
