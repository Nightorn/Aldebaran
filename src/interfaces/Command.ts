import { ColorResolvable, MessageEmbed, PermissionString as DJSPermission } from "discord.js";
import { Command } from "../groups/Command";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../structures/contexts/DiscordSlashMessageContext.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import Client from "../structures/djs/Client";
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
};

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
	registerSubcommands<T extends typeof Command>(...subcommands: T[]): void;
	run(
		ctx: MessageContext | DiscordMessageContext | DiscordSlashMessageContext,
		platform: Platform
	): void;
	toHelpEmbed(command: string, prefix: string): MessageEmbed;
};

export interface IImageCommand extends ICommand {
	image(ctx: MessageContext): void;
};
