import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../structures/DiscordClient.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";

import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";
import Command from "../groups/Command.js";

const drpgIDs = ["170915625722576896", "891614347015626762"];

export default async (client: DiscordClient, message: Message) => {
	if (message.webhookId) return;

	const guild = message.guild
		? await client.servers.fetchDiscord(message.guild.id)
		: null;

	let prefix = guild?.base.prefix || "";

	const author = await client.users.fetchDiscord(message.author.id);
	const ctx = new DiscordMessageContext(author, client, message, guild);

	if (guild && drpgIDs.includes(ctx.author.id)) {
		DiscordRPG(ctx);
	} else if (guild && !author.user.bot) {
		const drpgMatch = ctx.content.toLowerCase()
			.match(/.+(?=stats|adv|padv|mine|forage|fish|chop)/);
		if (drpgMatch) {
			const filter = (msg: Message) => drpgIDs.includes(msg.author.id);
			ctx.channel.awaitMessages({ filter, max: 1, time: 2000 }).then(() => {
				if (!guild.base.getSetting("discordrpgprefix")) {
					guild.base.setSetting("discordrpgprefix", drpgMatch[0]);
				}
			});
			const serverCtx = ctx as unknown as DiscordMessageContext<true>;
			DRPGAdventure(serverCtx);
			DRPGSides(serverCtx);
			DRPGPadventure(serverCtx);
		}
	}

	if (author.user.bot) return;
	if (!message.mentions.users.get(client.discord.user.id)) {
		if (ctx.content.indexOf(prefix) !== 0) return;
		if (ctx.content.slice(prefix.length)[0] === " ") return;
	} else {
		prefix = ctx.content.trim().substring(0, ctx.content.indexOf(">") + 1);
	}

	if (ctx.command && ctx.mode === "HELP") {
		ctx.reply(ctx.command.toHelpEmbed(prefix));
	} else if (ctx.command) {
		ctx.command.execute(ctx, "DISCORD").then(() => {
			const user = `USER: ${message.author.tag} (${message.author.id})`;
			console.log(`\x1b[34m- COMMAND: ${(ctx.command as Command).name} | ${user}\x1b[0m`);
		}).catch(err => {
			if (err.message === "INVALID_PERMISSIONS") {
				const embed = new MessageEmbed()
					.setTitle("You are not allowed to use this.")
					.setDescription(`This command requires permissions that you do not currently have. Please check \`${prefix}?${(ctx.command as Command).name}\` for more information about the requirements to use this command.`)
					.setFooter({
						text: message.author.username,
						iconURL: message.author.displayAvatarURL()
					})
					.setColor("RED");
				ctx.reply(embed);
			} else if (err.message === "NOT_NSFW_CHANNEL") {
				const embed = new MessageEmbed()
					.setTitle("You are using this command incorrectly.")
					.setDescription(
						"As this command shows NSFW content, you need to use this command in a NSFW channel."
					)
					.setFooter({
						text: message.author.username,
						iconURL: message.author.displayAvatarURL()
					})
					.setColor("RED");
				ctx.reply(embed);
			} else if (err.message === "INVALID_ARGS") {
				ctx.error("INVALID_ARGS", `Please check \`${prefix}?${(ctx.command as Command).name}\` for more information on how to use this command.`);
			} else if (err.message !== "INVALID_COMMAND") {
				console.error(err);
			}
		});
	}
};
