import { Client, ColorResolvable, MessageEmbed, PermissionString as DJSPermission, TextChannel } from "discord.js";
import AldebaranClient from "../structures/djs/Client.js";
import { PermissionString as AldebaranPermission, Platform } from "../utils/Constants";
import { CommandMetadata, ICommand } from "../interfaces/Command.js";
import MessageContext from "../structures/contexts/MessageContext.js";

export abstract class Command implements ICommand {
	aliases: string[];
	category: string = "General";
	color: ColorResolvable = "BLUE";
	client: AldebaranClient;
	example: string;
	hidden: boolean = false;
	metadata: CommandMetadata;
	name: string = "dummy";
	perms: { discord: DJSPermission[], aldebaran: AldebaranPermission[] };
	subcommands: Map<string, Command> = new Map();

	/**
   	* Command abstract class, extend it to build a command
   	*/
	constructor(client: AldebaranClient, metadata: CommandMetadata) {
		if (!(client instanceof Client)) { throw new TypeError("The specified Client is invalid"); }
		if (metadata === undefined) throw new TypeError("The metadata are invalid");
		this.perms = {
			discord: [],
			aldebaran: []
		};
		if (metadata.perms !== undefined) {
			if (metadata.perms.discord !== undefined) {
				if (!(metadata.perms.discord instanceof Array)) { throw new TypeError("The Discord permissions metadata are invalid"); } else this.perms.discord = metadata.perms.discord;
			}
			if (metadata.perms.aldebaran !== undefined) {
				if (!(metadata.perms.aldebaran instanceof Array)) { throw new TypeError("The permissions metadata are invalid"); } else this.perms.aldebaran = metadata.perms.aldebaran;
			}
		}
		this.aliases = metadata.aliases || [];
		this.client = client;
		this.example = !metadata.example ? "" : `\`${metadata.example}\``;
		this.metadata = metadata;
	}

	guildCheck(ctx: MessageContext) {
		return this.metadata.requiresGuild ? !!ctx.guild : true;
	}

	/**
   	* Checks if the context of execution is valid
   	*/
	async permsCheck(ctx: MessageContext) {
		let check = true;
		if (this.perms.discord && this.guildCheck(ctx)) {
			check = this.perms.discord
				.every(p => ctx.member!.permissionsIn(ctx.channel as TextChannel).has(p));
		}
		if (this.perms.aldebaran && check) {
			check = this.perms.aldebaran
				.every(perm => ctx.author.hasPermission(perm));
		}
		return check;
	}

	async check(ctx: MessageContext) {
		return await this.permsCheck(ctx) && this.guildCheck(ctx);
	}

	/**
	 * Executes the specified command
	 */
	async execute(ctx: MessageContext, platform: Platform): Promise<void> {
		const guild = this.guildCheck(ctx);
		if (!guild) throw new Error("NOT_IN_GUILD");
		const perms = await this.permsCheck(ctx);
		if (!perms) throw new Error("MISSING_PERMS");
		if (!ctx.argsCheck()) throw new Error("INVALID_ARGS");
		return this.run(ctx, platform);
	}

	/**
	 * Whether the string in parameter matches the identity (name, aliases) of this command
	 */
	matches(name: string) {
		return this.name === name || this.aliases.includes(name);
	}

	abstract run(ctx: MessageContext, platform: Platform): void;

	/**
	 * Whether this command supports the platform in parameter
	 */
	supports(platform: Platform) {
		return !this.metadata.platforms || this.metadata.platforms.includes(platform);
	}

	toHelpEmbed(prefix = "&") {
		const embed = new MessageEmbed()
			.setAuthor(
				`${this.client.name}  |  Command Help  |  ${this.name}`,
				this.client.user!.avatarURL()!
			)
			.setTitle(this.metadata.description)
			.addField("Category", this.category, true)
			.addField("Example", `${prefix}${this.name} ${this.example}`, true)
			.setColor("BLUE");
		if (this.metadata.help !== undefined)
			embed.setDescription(this.metadata.help);
		if (this.aliases.length > 0)
			embed.addField("Aliases", this.aliases.join(", "), true);
		if (this.subcommands.size > 0)
			embed.addField("Subcommands", Array.from(this.subcommands.keys()).join(", "), true);
		if (this.perms.discord.length > 0)
			embed.addField("Discord Perms", this.perms.discord.join(", "), true);
		if (this.perms.aldebaran.length > 0)
			embed.addField(`${this.client.name} Perms`, this.perms.aldebaran.join(", "), true);
		if (this.metadata.args !== undefined) {
			let args = "";
			let usage = "";
			for (const [id, data] of Object.entries(this.metadata.args)) {
				const begin = `\`${id}\` (${data.as}${data.optional ? ", optional" : ""})`;
				const t = data.as.includes("?") ? ["[", "]"] : ["<", ">"];
				if ((data.as === "mode" || data.as === "boolean") && data.flag) {
					args += `${begin} - \`-${data.flag.short}\`/\`--${data.flag.long}\`${data.desc ? ` - *${data.desc}*` : ""}\n`;
					usage += `${t[0]}-${data.flag.short}|--${data.flag.long}${data.as !== "boolean" ? ` ${id}` : ""}${t[1]} `;
				} else {
					args += `${begin}${data.desc ? ` - *${data.desc}*` : ""}\n`;
					usage += `${t[0]}${id}${t[1]} `;
				}
			}
			embed.addField("Usage", `${prefix}${this.name} \`${usage.trim()}\``, true);
			embed.addField("Arguments", args);
		}
		return embed;
	}

	registerSubcommands<T extends typeof Command>(...subcommands: T[]) {
		subcommands.forEach((Structure: any) => {
			const command = new Structure(this.client);
			const name = command.constructor.name
				.replace("Subcommand", "").toLowerCase();
			command.name = name;
			this.subcommands.set(name, command);
		}, this);
	}

	get shortDesc() {
		const desc = this.metadata.description;
		if (desc.length > 60)
			return `${this.metadata.description.substr(0, 60)}...`;
		return desc;
	}
};

export const Embed = class Embed extends MessageEmbed {
	constructor(command: ICommand | Command) {
		super();
		this.setColor(command.color);
	}
};
