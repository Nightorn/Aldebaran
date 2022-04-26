import { Message, MessageEmbed } from "discord.js";
import AldebaranClient from "../structures/djs/Client.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";

import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";

export default async (client: AldebaranClient, message: Message) => {
	if (message.webhookId && !message.interaction) return;

	const guild = message.guild
		? await client.customGuilds.fetch(message.guild.id)
		: undefined;

	let prefix = guild
		? process.argv[2] === "dev"
			? process.argv[4] || process.env.PREFIX!
			: guild.prefix
		: "";

	const author = await client.customUsers.fetch(message.author.id);
	const interactionUser = message.interaction !== null ? 
		await client.customUsers.fetch(message.interaction.user.id) : 
		undefined;

	const ctx = new DiscordMessageContext(
		client,
		message,
		author, 
		guild,
		interactionUser
	);

	if (author.banned || interactionUser?.banned) return;

	const drpgIDs = ["170915625722576896", "891614347015626762"];
	if (guild && drpgIDs.includes(ctx.author.id) && ctx.interaction !== null) {
		if (["adv", "padv"].includes(ctx.interaction.commandName)) {
			// Health monitor
			DiscordRPG(ctx);
			// Adv or Party Adv
			if (ctx.interaction.commandName === "adv")
				DRPGAdventure(ctx);
			else DRPGPadventure(ctx);
		} else if (["mine", "forage", "fish", "chop"].includes(ctx.interaction.commandName)) {
			DRPGSides(ctx);
		}
	}

	if (author.user.bot) return;
	if (!message.mentions.users.get(client.user.id)) {
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
			console.log(`\x1b[34m- COMMAND: ${ctx.command!.name} | ${user}\x1b[0m`);
		}).catch(err => {
			if (err.message === "INVALID_PERMISSIONS") {
				const embed = new MessageEmbed()
					.setTitle("You are not allowed to use this.")
					.setDescription(`This command requires permissions that you do not currently have. Please check \`${prefix}?${ctx.command!.name}\` for more information about the requirements to use this command.`)
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
				ctx.error("INVALID_ARGS", `Please check \`${prefix}?${ctx.command!.name}\` for more information on how to use this command.`);
			} else if (err.message !== "INVALID_COMMAND") {
				console.error(err);
			}
		});
	}
};
