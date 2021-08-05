import AldebaranClient from "../structures/djs/Client.js";
import { Command } from "../groups/Command.js";
import Message from "../structures/djs/Message.js";

export default class CommandHandler {
	private static instance: CommandHandler;
	client: AldebaranClient;
	commands: Map<string, Command> = new Map();

	private constructor(client: AldebaranClient) {
		this.client = client;
	}

	public static getInstance(client?: AldebaranClient): CommandHandler {
		if (!CommandHandler.instance && client) {
			CommandHandler.instance = new CommandHandler(client);
		} else if (!CommandHandler.instance && !client) {
			throw new TypeError("CommandHandler requires an AldebaranClient as an argument to be instantiated.");
		}
		return CommandHandler.instance;
	}

	execute(commandName: string, message: Message) {
		const override = this.checkOverrides(message.guild.commands, commandName);
		if (override === false) return;
		commandName = override;
		if (!this.exists(commandName)) throw new TypeError("INVALID_COMMAND");
		const command = this.get(commandName)!;
		if (message.args.length === 0) {
			if (command.subcommands.size > 0) {
				if (command.metadata.allowIndexCommand) {
					command.execute(message);
				} else {
					throw new TypeError("INVALID_COMMAND");
				}
			} else {
				command.execute(message);
			}
		} else if (command.subcommands.size > 0) {
			if (command.subcommands.get(message.args[0]) !== undefined) {
				command.subcommands.get(message.args[0]).execute(message);
			} else if (command.metadata.allowUnknownSubcommands) {
				command.execute(message);
			} else {
				throw new TypeError("INVALID_COMMAND");
			}
		} else {
			command.execute(message);
		}
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

	register(Structure: any) {
		const command: Command = new Structure(this.client);
		command.name = command.metadata.name
			|| command.constructor.name.replace("Command", "").toLowerCase();
		if (command.registerCheck()) {
			// Implement subcommands (command.checkSubcommands(path);)
			this.commands.set(command.name, command);
			command.aliases.forEach(alias => {
				this.commands.set(alias, command);
			});
		}
	}

	registerMultiple(...structures: any) {
		structures.forEach(this.register, this);
	}
};
