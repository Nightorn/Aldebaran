import { Message, MessageEmbed } from "discord.js";
import { IImageCommand } from "../interfaces/Command.js";
import AldebaranClient from "../structures/djs/Client.js";
import MessageContext from "../structures/aldebaran/MessageContext.js";

import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";

export default async (client: AldebaranClient, message: Message) => {
	if (message.webhookId) return;

	const guild = message.guild
		? await client.customGuilds.fetch(message.guild.id)
		: null;

	const prefix = guild
		? process.argv[2] === "dev"
			? process.argv[4] || process.env.PREFIX!
			: guild.prefix
		: "";

	const ctx = new MessageContext(client, message, prefix);

	const user = await ctx.author();
	if (user.banned) return;

	if (guild && ctx.message.author.id === "170915625722576896") {
		DiscordRPG(ctx);
	} else if (!user.user.bot) {
		const drpgMatch = ctx.message.content.toLowerCase().match(/.+(?=stats|adv)/);
		if (drpgMatch !== null) {
			const filter = (msg: Message) => msg.author.id === "170915625722576896";
			ctx.message.channel.awaitMessages({ filter, max: 1, time: 2000 })
				.then(async () => {
					if (!guild!.settings.discordrpgprefix) {
						guild!.settings.discordrpgprefix = drpgMatch[0];
					}
				});
			DRPGAdventure(ctx);
			DRPGSides(ctx);
			DRPGPadventure(ctx);
		}
	}

	if (user.user.bot) return;
	if (ctx.message.content.indexOf(prefix) !== 0) return;
	if (ctx.message.content.slice(prefix.length)[0] === " ") return;

	const args = ctx.message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift()!.toLowerCase();

	const sliced = command.slice(1);
	if (command.indexOf("?") === 0) {
		ctx.reply(ctx.client.commands.getHelp(sliced, prefix));
	} else if (command.indexOf("#") === 0) {
		ctx.client.commands.bypassRun(sliced, message, prefix).catch(err => {
			if (err.message === "INVALID_COMMAND") return;
			if (err.message === "UNALLOWED_ADMIN_BYPASS") {
				const embed = new MessageEmbed()
					.setTitle("You are not allowed to use this.")
					.setDescription(`By using \`#\`, you are trying to bypass Discord permissions requirements and other checks, which is only allowed for ${ctx.client.name} Administrators.`)
					.setFooter(
						ctx.message.author.username,
						ctx.message.author.displayAvatarURL()
					)
					.setColor("RED");
				ctx.reply(embed);
			} else {
				console.error(err);
			}
		});
	} else if (command.indexOf("-") === 0) {
		try {
			const cmd = ctx.client.commands.get(sliced) as IImageCommand;
			if (cmd && cmd.image) {
				const cArgs = cmd.metadata.args;
				cmd.image(new MessageContext(client, message, prefix, cArgs));
			}
		} catch (err) {
			const embed = new MessageEmbed()
				.setTitle("The requested resource has not been found.")
				.setDescription("By using `-`, you are trying to view the image version of this command, however, the image version of this command is not available. Try again without `-`.")
				.setFooter(message.author.username, message.author.displayAvatarURL())
				.setColor("RED");
			ctx.reply(embed);
		}
	} else {
		client.commands.execute(command, message, prefix).catch(err => {
			if (err.message === "INVALID_PERMISSIONS") {
				const embed = new MessageEmbed()
					.setTitle("You are not allowed to use this.")
					.setDescription(`This command requires permissions that you do not currently have. Please check \`${prefix}?${command}\` for more informations about the requirements to use this command.`)
					.setFooter(message.author.username, message.author.displayAvatarURL())
					.setColor("RED");
				ctx.reply(embed);
			} else if (err.message === "NOT_NSFW_CHANNEL") {
				const embed = new MessageEmbed()
					.setTitle("You are using this command incorrectly.")
					.setDescription(
						"As this command shows NSFW content, you need to use this command in a NSFW channel."
					)
					.setFooter(message.author.username, message.author.displayAvatarURL())
					.setColor("RED");
				ctx.reply(embed);
			} else if (err.message === "INVALID_COMMAND") {
				console.log(`Someone unsuccessfully tried ${command}.`);
			} else {
				console.error(err);
			}
		});
	}
	console.log(
		`\x1b[34m- COMMAND: ${command} | USER: ${message.author.tag} (${
			message.author.id
		}) | ARGS: ${args.join(" ") || "None"}\x1b[0m`
	);
};
