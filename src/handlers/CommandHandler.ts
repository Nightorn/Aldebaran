import fs from "fs";
import AldebaranClient from "../structures/djs/Client";
import { Command } from "../groups/Command.js";
import Message from "../structures/djs/Message";

export default class CommandHandler {
	client: AldebaranClient;
	commands: Map<string, Command> = new Map();

	constructor(client: AldebaranClient) {
		this.client = client;
		this.registerAllCommands();
	}

	execute(commandName: string, message: Message) {
		const override = this.checkOverrides(message.guild.commands, commandName);
		if (override === false) return;
		commandName = override;
		if (!this.exists(commandName)) throw new TypeError("INVALID_COMMAND");
		const command = this.get(commandName)!;
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
	}

	static createArgs(message: Message) {
		const args = message.content.split(" ");
		args.shift();
		return args;
	}

	get size() {
		let size = 0;
		for (const [name, data] of this.commands)
			if (name === data.name) size++;
		return size;
	}

	get(command: string) {
		return this.commands.get(command);
	}

	bypassRun(command: string, message: Message) {
		if (!message.author.hasPermission("ADMINISTRATOR")) { throw new Error("UNALLOWED_ADMIN_BYPASS"); }
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		return this.commands.get(command)!.run(
			this.client, message, CommandHandler.createArgs(message)
		);
	}

	// eslint-disable-next-line class-methods-use-this
	checkOverrides(commands: any, command: string) {
		const cmd = commands[command];
		if (cmd === undefined) return command;
		return cmd;
	}

	exists(command: string) {
		return this.commands.get(command) !== undefined;
	}

	getHelp(command: string, prefix = "&") {
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		return this.commands.get(command)!.toHelpEmbed(command, prefix);
	}

	register(Structure: any, path: string) {
		const command: Command = new Structure(this.client);
		command.name = path.match(/\w+(?=(.js))/g)![0];
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
		const exploreFolder = (path: string) => {
			const files = fs.readdirSync(path);
			for (const file of files) {
				if (fs.statSync(path + file).isDirectory()) {
					exploreFolder(`${path}${file}/`);
				} else {
					import(`../${path + file}`).then(command => {
						this.register(command.default, path + file);
					}).catch(err => {
						console.error(`\x1b[31m${path + file} is invalid.\x1b[0m`);
						console.error(err);
					});
				}
			}
		};
		exploreFolder("./commands/");
		return commands;
	}
};
