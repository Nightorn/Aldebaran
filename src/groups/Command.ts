import {
	GuildMember as DiscordMember,
	PermissionsString as DiscordPermission,
	TextChannel as DiscordChannel
} from "discord.js";
import {
	Member as RevoltMember,
	Permission as RevoltPermission,
	Channel as RevoltChannel
} from "revolt.js";
import { PermissionString as AldebaranPermission, Platform } from "../utils/Constants.js";
import { CommandMetadata, Context, ICommand } from "../interfaces/Command.js";
import MessageContext from "../structures/contexts/MessageContext.js";
import Embed from "../structures/Embed.js";

const name = process.env.NAME || "Aldebaran";

export default abstract class Command implements ICommand {
	aliases: string[];
	category = "General";
	color = "#3498db";
	example: string;
	hidden = false;
	metadata: CommandMetadata;
	name = "dummy";
	perms: {
		aldebaran: AldebaranPermission[],
		discord: DiscordPermission[],
		revolt: (keyof typeof RevoltPermission)[]
	} = { aldebaran: [], discord: [], revolt: [] };
	subcommands: Map<string, Command> = new Map();

	/**
   	* Command abstract class, extend it to build a command
   	*/
	constructor(metadata: CommandMetadata) {
		if (metadata.perms !== undefined) {
			if (metadata.perms.discord !== undefined) {
				if (!(metadata.perms.discord instanceof Array)) { throw new TypeError("The Discord permissions metadata are invalid"); } else this.perms.discord = metadata.perms.discord;
			}
			if (metadata.perms.aldebaran !== undefined) {
				if (!(metadata.perms.aldebaran instanceof Array)) { throw new TypeError("The permissions metadata are invalid"); } else this.perms.aldebaran = metadata.perms.aldebaran;
			}
		}
		this.aliases = metadata.aliases || [];
		this.example = !metadata.example ? "" : `\`${metadata.example}\``;
		this.metadata = metadata;
	}

	guildCheck(ctx: MessageContext) {
		return this.metadata.requiresGuild ? !!ctx.server : true;
	}

	/**
   	* Checks if the context of execution is valid
   	*/
	async permsCheck(ctx: MessageContext, platform: Platform) {
		let check = true;
		if (
			platform.includes("DISCORD")
			&& this.perms.discord
			&& this.guildCheck(ctx)
		) {
			check = this.perms.discord.every(p => (ctx.member as DiscordMember)
				.permissionsIn(ctx.channel as DiscordChannel)
				.has(p));
		}
		if (
			platform === "REVOLT"
			&& check
			&& this.perms.revolt
			&& this.guildCheck(ctx)
		) {
			const channel = ctx.channel as RevoltChannel;
			const member = ctx.member as RevoltMember;
			check = member.hasPermission(channel, ...this.perms.revolt);
		}
		if (check && this.perms.aldebaran) {
			check = this.perms.aldebaran
				.every(perm => ctx.author.base.hasPermission(perm));
		}
		return check;
	}

	async check(ctx: MessageContext, platform: Platform) {
		return await this.permsCheck(ctx, platform) && this.guildCheck(ctx);
	}

	createEmbed() {
		return new Embed().setColor(this.color);
	}

	/**
	 * Executes the specified command
	 */
	async execute(ctx: MessageContext, platform: Platform): Promise<void> {
		const guild = this.guildCheck(ctx);
		if (!guild) throw new Error("NOT_IN_GUILD");
		const perms = await this.permsCheck(ctx, platform);
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

	abstract run(
		ctx: Context<typeof this.metadata.requiresGuild>,
		platform: Platform
	): void;

	/**
	 * Whether this command supports the platform in parameter
	 */
	supports(platform: Platform) {
		return !this.metadata.platforms || this.metadata.platforms.includes(platform);
	}

	toHelpEmbed(prefix = "&") {
		const embed = new Embed()
			.setTitle(this.metadata.description)
			.addField("Category", this.category, true)
			.addField("Example", `${prefix}${this.name} ${this.example}`, true)
			.setColor(this.color);
		if (this.metadata.help !== undefined)
			embed.setDescription(this.metadata.help);
		if (this.aliases.length > 0)
			embed.addField("Aliases", this.aliases.join(", "), true);
		if (this.subcommands.size > 0)
			embed.addField("Subcommands", Array.from(this.subcommands.keys()).join(", "), true);
		if (this.perms.discord.length > 0)
			embed.addField("Discord Perms", this.perms.discord.join(", "), true);
		if (this.perms.aldebaran.length > 0)
			embed.addField(`${name} Perms`, this.perms.aldebaran.join(", "), true);
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

	registerSubcommands(...subcommands: { new(): Command }[]) {
		subcommands.forEach(Structure => {
			const command = new Structure();
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
}
