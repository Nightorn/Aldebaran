import { Client, MessageEmbed, PermissionString as DJSPermission } from "discord.js";
import AldebaranClient from "../structures/djs/Client.js";
import CommandMetadata from "../interfaces/CommandMetadata.js";
import { PermissionString as AldebaranPermission } from "../utils/Constants"
import Message from "../structures/djs/Message.js";

export abstract class Command {
	perms: { discord: DJSPermission[]; aldebaran: AldebaranPermission[]; };
	aliases: string[];
	category: string;
	color: string;
	client: AldebaranClient;
	example: string;
	hidden: boolean;
	metadata: CommandMetadata;
	subcommands: Map<any, any>;
	usage: string;
	name: any;
	args: any;

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
				if (!(metadata.perms.aldebaran instanceof Array)) { throw new TypeError("The Aldebaran permissions metadata are invalid"); } else this.perms.aldebaran = metadata.perms.aldebaran;
			}
		}
		this.aliases = metadata.aliases || [];
		this.category = "General";
		this.color = "BLUE";
		this.client = client;
		this.example = !metadata.example ? "" : `\`${metadata.example}\``;
		this.hidden = false;
		this.metadata = metadata;
		this.subcommands = new Map();
		this.usage = !metadata.usage ? "" : `\`${metadata.usage}\``;
	}

	/**
   	* Checks if the context of execution is valid
   	*/
	permsCheck(message: Message) {
		let check = true;
		if (this.perms.discord !== undefined)
			check = this.perms.discord
				.every(perm => message.member!.permissionsIn(message.channel).has(perm));
		if (this.perms.aldebaran !== undefined && check)
			check = this.perms.aldebaran
				.every(perm => message.author.hasPermission(perm));
		return check;
	}

	check(message: Message) {
		return this.permsCheck(message);
	}

	/**
   	* Executes the command
   	*/
	execute(message: Message) {
		const args = message.content.split(" ");
		args.shift();
		if (this.check(message)) {
			return this.run(this.client, message,
				message.getArgs(this.metadata.args));
		}
		throw new Error("INVALID_PERMISSIONS");
	}

	abstract run(client: AldebaranClient, message: Message, args: any): void;

	// eslint-disable-next-line class-methods-use-this
	registerCheck() {
		return true;
	}

	toHelpEmbed(command: string, prefix = "&") {
		const embed = new MessageEmbed()
			.setAuthor(
				`Aldebaran  |  Command Help  |  ${this.name}`,
				this.client.user!.avatarURL()!
			)
			.setTitle(this.metadata.description)
			.addField("Category", this.category, true)
			.addField("Example", `${prefix}${command} ${this.example}`, true)
			.setColor("BLUE");
		if (this.metadata.usage !== undefined)
			embed.addField("Usage", `${prefix}${command} ${this.usage}`, true);
		if (this.metadata.help !== undefined)
			embed.setDescription(this.metadata.help);
		if (this.aliases.length > 0)
			embed.addField("Aliases", this.aliases.join(", "), true);
		if (this.subcommands.size > 0)
			embed.addField("Subcommands", Array.from(this.subcommands.keys()).join(", "), true);
		if (this.args !== undefined)
			embed.addField("Arguments", this.args, true);
		if (this.perms.discord.length > 0)
			embed.addField("Discord Perms", this.perms.discord.join(", "), true);
		if (this.perms.aldebaran.length > 0)
			embed.addField("Aldebaran Perms", this.perms.aldebaran.join(", "), true);
		if (this.metadata.args !== undefined) {
			let args = "";
			let usage = "";
			for (const [id, data] of Object.entries(this.metadata.args)) {
				const as = data.as.replace("?", "");
				const begin = `\`${id}\` (${as}${data.as.includes("?") ? ", optional" : ""})`;
				const t = data.as.includes("?") ? ["[", "]"] : ["<", ">"];
				if (data.flag === undefined) args += `${begin}${data.desc ? ` - *${data.desc}*` : ""}\n`;
				else args += `${begin} - \`-${data.flag.short}\`/\`--${data.flag.long}\`${data.desc ? ` - *${data.desc}*` : ""}\n`;
				usage += data.flag === undefined ? `${t[0]}${id}${t[1]} ` : `${t[0]}-${data.flag.short}|--${data.flag.long}${as !== "boolean" ? ` ${id}` : ""}${t[1]} `;
			}
			embed.addField("Usage", `${prefix}${command} \`${usage.trim()}\``, true);
			embed.addField("Arguments", args);
		}
		return embed;
	}

	registerSubcommands(...subcommands: any) {
		subcommands.forEach((Structure: any) => {
			const command = new Structure(this.client);
			const name = command.constructor.name
				.replace("Subcommand", "").toLowerCase();
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
	constructor(command: Command) {
		super();
		this.setColor(command.color);
	}
};
