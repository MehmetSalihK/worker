const { Command } = require('strelitzia');
const unindent = require('../unindent');

class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			description: 'This is a simple help command.',
			group: 'util',
			format: '[command]',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(message, args) {
		const { groups } = this.client.registry;
		const commands = this.client.registry.findCommands(args[0] ? args[0] : '');
		if (!commands.length || !commands[0]) return;
		if (args[0]) {
			await this.client.rest.channels[message.channel_id].messages.create({
				embed: {
					title: `Command ${commands[0].name}`,
					description: `${commands[0].description}`,
					fields: [
						{
							name: '❯ Group',
							value: `${commands[0].group.name} (\`${commands[0].groupId}:${commands[0].name}\`)`
						},
						{
							name: '❯ Format',
							value: `${commands[0].usage(commands[0].format ? commands[0].format : '')}`
						}
					]
				}
			});
		} else {
			await this.client.rest.channels[message.channel_id].messages.create({
				embed: {
					title: 'Help',
					description: unindent`${groups.map(grp => `
						__${grp.name}__
						${grp.commands.map(cmd => `**${cmd.name}:** ${cmd.description}`).join('\n')}
					`).join('\n')}`
				}
			});
		}
	}
}

module.exports = Help;
