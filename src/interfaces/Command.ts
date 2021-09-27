import { ColorResolvable, MessageEmbed, PermissionString as DJSPermission } from "discord.js";
import { Command } from "../groups/Command";
import MessageContext from "../structures/aldebaran/MessageContext";
import Client from "../structures/djs/Client";
import { PermissionString as AldebaranPermission } from "../utils/Constants";
import { Args } from "./Arg.js";

export interface CommandMetadata {
	aliases?: string[],
	allowIndexCommand?: boolean,
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
	requiresGuild?: boolean,
	usage?: string,
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
	usage: string;

	check(ctx: MessageContext): Promise<boolean>;
	execute(ctx: MessageContext): object | void;
	guildCheck(ctx: MessageContext): boolean;
	permsCheck(ctx: MessageContext): Promise<boolean>;
	registerSubcommands<T extends typeof Command>(...subcommands: T[]): void;
	run(ctx: MessageContext): void;
	toHelpEmbed(command: string, prefix: string): MessageEmbed;
};

export interface IImageCommand extends ICommand {
	image(ctx: MessageContext): void;
};
