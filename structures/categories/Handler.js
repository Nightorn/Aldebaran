const fs = require("fs");
const { Command } = require("./GeneralCategory");

module.exports = class CommandHandler {
	constructor(client) {
		this.client = client;
		this.commands = new Map();
		this.registerAllCommands();
	}

	execute(command, message) {
		const override = this.checkOverrides(message.guild.commands, command);
		if (override === false) return;
		command = override;
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		command = this.get(command);
		if (message.args.length === 0)
			if (command.subcommands.size > 0)
				if (command.metadata.allowIndexCommand)
					command.execute(message);
				else throw new TypeError("INVALID_COMMAND");
			else command.execute(message);
		else if (command.subcommands.size > 0)
			if (command.subcommands.get(message.args[0]) !== undefined)
				command.subcommands.get(message.args[0]).execute(message);
			else if (command.metadata.allowUnknownSubcommands)
				command.execute(message);
			else throw new TypeError("INVALID_COMMAND");
		else command.execute(message);

		this.client.stats.commands.total++;
		this.client.stats.commands.all[command]++;
		if (this.client.stats.users.all[message.author.id] === undefined) {
			this.client.stats.users.all[message.author.id] = 0;
			this.client.stats.users.total++;
		}
		this.client.stats.users.all[message.author.id]++;
		if (this.client.stats.servers.all[message.guild.id] === undefined) {
			this.client.stats.servers.all[message.guild.id] = 0;
			this.client.stats.servers.total++;
		}
		this.client.stats.servers.all[message.guild.id]++;
	}

	static createArgs(message) {
		const args = message.content.split(" ");
		args.shift();
		return args;
	}

	get(command) {
		return this.commands.get(command);
	}

	bypassRun(command, message) {
		if (!message.author.checkPerms("ADMIN")) { throw new Error("UNALLOWED_ADMIN_BYPASS"); }
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		const args = [this.client, message, this.constructor.createArgs(message)];
		return this.commands.get(command).run(...args);
	}

	// eslint-disable-next-line class-methods-use-this
	checkOverrides(commands, command) {
		const cmd = commands[command];
		if (cmd === undefined) return command;
		return cmd;
	}

	exists(command) {
		return this.commands.get(command) !== undefined;
	}

	getHelp(command, prefix = "&") {
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		return this.commands.get(command).toHelpEmbed(command, prefix);
	}

	register(Structure, path) {
		const command = new Structure(this.client);
		if (command.registerCheck()) {
			command.checkSubcommands(path);
			if (!command.metadata.subcommand) {
				this.commands.set(command.name, command);
				command.aliases.forEach(alias => {
					this.commands.set(alias, command);
				});
			}
		}
	}

	registerAllCommands() {
		const commands = new Map();
		const exploreFolder = path => {
			const files = fs.readdirSync(path);
			for (const file of files) {
				if (fs.statSync(path + file).isDirectory()) {
					exploreFolder(`${path}${file}/`);
				} else if (path !== "Commands/inProgress/") {
					try {
						// eslint-disable-next-line import/no-dynamic-require, global-require
						let command = require(`../../${path + file}`);
						if (typeof command === "object") {
							const meta = {
								description: "This is an auto-generated help message.",
								name: file.replace(/\.js$/, "")
							};
							Object.assign(meta, command.infos);
							class fakeClass extends Command {
								constructor(client) {
									super(client, meta);
								}
							}
							fakeClass.prototype.run = command.run;
							command = fakeClass;
							console.log(`${meta.name} needs to be converted to a class, but will still run in the meantime.`);
						}
						this.register(command, path + file);
					} catch (err) {
						console.error(
							`\x1b[31m${path
							+ file} is invalid and incompatible with Aldebaran 1.7.\x1b[0m`
						);
						console.error(err);
					}
				}
			}
		};
		exploreFolder("Commands/");
		return commands;
	}
};
