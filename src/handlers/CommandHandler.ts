import AldebaranClient from "../structures/djs/Client.js";
import Command from "../groups/Command.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Arg } from "../utils/Args.js";
import { Platform, SlashCommandOption as Option } from "../utils/Constants.js";

export default class CommandHandler {
	private static instance: CommandHandler;
	client: AldebaranClient;
	commands: Command[] = [];
	slashCommands: SlashCommandBuilder[] = [];

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

	get(command: string, platform: Platform) {
		return this.commands.find(c => c.matches(command) && c.supports(platform));
	}

	exists(command: string, platform: Platform) {
		return !!this.get(command, platform);
	}

	static patchOption<T extends Option>(option: T, name: string, metadata: Arg) {
		try {
			return option.setName(name.toLowerCase())
				.setDescription(metadata.desc)
				.setRequired(!metadata.optional || false) as T;
		} catch (err) {
			throw new TypeError(`There is an issue with the '${name}' command.\n${err}`);
		}
	}

	register(...structures: (typeof Command)[]) {
		structures.forEach(Structure => {
			const command: Command = new (Structure as any)(this.client);
			command.name = command.metadata.name
				|| command.constructor.name.slice(0, -7).toLowerCase();
			this.commands.push(command);

			if (process.env.DEPLOY_SLASH && command.supports("DISCORD_SLASH")) {
				const slash = new SlashCommandBuilder()
					.setName(command.name)
					.setDescription(command.metadata.description);

				if (command.metadata.args) {
					for (const [name, meta] of Object.entries(command.metadata.args)) {
						if (meta.as === "boolean") {
							slash.addBooleanOption(o => CommandHandler.patchOption(o, name, meta));
						} else if (meta.as === "user") {
							slash.addUserOption(o => CommandHandler.patchOption(o, name, meta));
						} else if (meta.as === "mode") {
							slash.addStringOption(o => CommandHandler.patchOption(o, name, meta)
								.setChoices(meta.choices));
						} else if (meta.as === "string" || meta.as === "expression") {
							slash.addStringOption(o => CommandHandler.patchOption(o, name, meta));
						} else if (meta.as === "number") {
							slash.addIntegerOption(o => CommandHandler.patchOption(o, name, meta));
						}
					}
				}

				for (const [name, subcommand] of command.subcommands) {
					if (subcommand.supports("DISCORD_SLASH")) {
						slash.addSubcommand(sub => sub
							.setName(name)
							.setDescription(subcommand.metadata.description)
						);
					}
				}
				
				this.slashCommands.push(slash);
			}
		}, this);
	}
}
