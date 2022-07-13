import { ColorResolvable, MessageEmbed, PermissionString as DJSPermission } from "discord.js";
import Command from "../groups/Command.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../structures/contexts/DiscordSlashMessageContext.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import Client from "../structures/Client.js";
import { Args } from "../utils/Args";
import { PermissionString as AldebaranPermission, Platform } from "../utils/Constants";

export interface CommandMetadata {
	aliases?: string[],
	allowUnknownSubcommands?: boolean,
	args?: Args,
	cooldown?: {
		group?: string,
		amount?: number,
		resetInterval?: number
	},
	description: string,
	example?: string,
	help?: string,
	name?: string,
	perms?: {
		discord?: DJSPermission[],
		aldebaran?: AldebaranPermission[]
	},
	platforms?: Platform[],
	requiresGuild?: boolean
}

export type Context<T extends boolean | undefined = false> =
	MessageContext<T extends boolean ? T : false>
	| DiscordMessageContext<T extends boolean ? T : false>
	| DiscordSlashMessageContext;

export interface ICommand {
	aliases: string[];
	category: string;
	color: ColorResolvable;
	client: Client;
	example: string;
	hidden: boolean;
	metadata: CommandMetadata;
	name: string;
	perms: { discord: DJSPermission[], aldebaran: AldebaranPermission[] };
	subcommands: Map<string, ICommand>;

	check(ctx: MessageContext): Promise<boolean>;
	execute(ctx: MessageContext, platform: Platform): object | void;
	guildCheck(ctx: MessageContext): boolean;
	permsCheck(ctx: MessageContext): Promise<boolean>;
	registerSubcommands(...subcommands: { new(c: Client): Command }[]): void;
	run(
		this: ICommand,
		ctx: Context<typeof this.metadata.requiresGuild>,
		platform: Platform
	): void;
	toHelpEmbed(command: string, prefix: string): MessageEmbed;
}
