import { PermissionsString as DJSPermission } from "discord.js";
import Command from "../groups/Command.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import Client from "../structures/Client.js";
import { Args } from "../utils/Args";
import { PermissionString as AldebaranPermission, Platform } from "../utils/Constants";
import DiscordContext from "../structures/contexts/DiscordContext.js";
import Embed from "../structures/Embed.js";

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
	| DiscordContext<T extends boolean ? T : false>;

export interface ICommand {
	aliases: string[];
	category: string;
	color: string;
	example: string;
	hidden: boolean;
	metadata: CommandMetadata;
	name: string;
	perms: { discord: DJSPermission[], aldebaran: AldebaranPermission[] };
	subcommands: Map<string, ICommand>;

	check(ctx: MessageContext, platform: Platform): Promise<boolean>;
	execute(ctx: MessageContext, platform: Platform): unknown;
	guildCheck(ctx: MessageContext): boolean;
	permsCheck(ctx: MessageContext, platform: Platform): boolean;
	registerSubcommands(...subcommands: { new(c: Client): Command }[]): void;
	run(
		this: ICommand,
		ctx: Context<typeof this.metadata.requiresGuild>,
		platform: Platform
	): void;
	toHelpEmbed(command: string, prefix: string): Embed;
}
