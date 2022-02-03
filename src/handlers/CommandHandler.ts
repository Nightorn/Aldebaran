import { Message } from "discord.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Command } from "../groups/Command.js";
import MessageContext from "../structures/aldebaran/MessageContext.js";
import { ICommand } from "../interfaces/Command.js";

export default class CommandHandler {
	private static instance: CommandHandler;
	client: AldebaranClient;
	commands: Map<string, ICommand> = new Map();

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

	async execute(name: string, message: Message, prefix: string) {
		if (message.guild) {
			const guild = await this.client.customGuilds.fetch(message.guild.id);
		}
		if (!this.exists(name)) throw new TypeError("INVALID_COMMAND");
		const command = this.get(name)!;
		const cArgs = command.metadata.args;
		const ctx = new MessageContext(this.client, message, prefix, cArgs);
		const args = ctx.getSplitArgs();
		if (args.length === 0) {
			if (command.subcommands.size > 0) {
				if (command.metadata.allowIndexCommand) {
					return command.execute(ctx);
				} else {
					throw new TypeError("INVALID_COMMAND");
				}
			} else {
				return command.execute(ctx);
			}
		} else if (command.subcommands.size > 0) {
			const subcommand = args.shift()!;
			if (command.subcommands.get(subcommand)) {
				ctx.setLevel(2);
				return command.subcommands.get(subcommand)!.execute(ctx);
			} else if (command.metadata.allowUnknownSubcommands) {
				return command.execute(ctx);
			} else {
				throw new TypeError("INVALID_COMMAND");
			}
		} else {
			return command.execute(ctx);
		}
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

	async bypassRun(name: string, message: Message, prefix: string) {
		if (!this.exists(name)) throw new TypeError("INVALID_COMMAND");
		const command = this.commands.get(name)!;
		const { args } = command.metadata;
		const ctx = new MessageContext(this.client, message, prefix, args);
		const user = await this.client.customUsers.fetch(ctx.message.author.id);
		if (!user.hasPermission("ADMINISTRATOR")) {
			throw new Error("UNALLOWED_ADMIN_BYPASS");
		}
		return command.execute(ctx);
	}

	exists(command: string) {
		return !!this.commands.get(command);
	}

	getHelp(command: string, prefix = "&") {
		if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
		return this.commands.get(command)!.toHelpEmbed(command, prefix);
	}

	register(...structures: (typeof Command)[]) {
		structures.forEach(Structure => {
			const command: Command = new (Structure as any)(this.client);
			command.name = command.metadata.name
				|| command.constructor.name.slice(0, -7).toLowerCase();
			this.commands.set(command.name, command);
			command.aliases.forEach(alias => {
				this.commands.set(alias, command);
			});
		}, this);
	}
};
