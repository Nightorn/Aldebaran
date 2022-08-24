import { Message as DjsMessage, EmbedBuilder } from "discord.js";
import { Message as RjsMessage } from "revolt.js";
import DiscordClient from "../structures/DiscordClient.js";
import RevoltClient from "../structures/RevoltClient.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import RevoltMessageContext from "../structures/contexts/RevoltMessageContext.js";
import Command from "../groups/Command.js";
import MessageContext from "../structures/contexts/MessageContext.js";

function log(ctx: MessageContext) {
	const command = ctx.command as Command;
	const user = `USER: ${ctx.author.tag} (${ctx.author.id})`;
	console.log(`\x1b[34m- COMMAND: ${command.name} | ${user}\x1b[0m`);
}

const allowNonSlash = process.env.ALLOW_NON_SLASH_COMMANDS;

export async function discordMessage(
	client: DiscordClient,
	message: DjsMessage
) {
	if (
		(!message.mentions.users.has(client.discord.user.id) && !allowNonSlash)
		|| (message.webhookId && !message.interaction)
		|| message.author.bot
	) return;

	const guild = message.guild
		? await client.servers.fetchDiscord(message.guild.id)
		: null;

	const author = await client.users.fetchDiscord(message.author.id);
	const ctx = new DiscordMessageContext(author, client, message, guild);

	if (ctx.content.indexOf(ctx.prefix) !== 0) return;
	if (ctx.command && ctx.mode === "HELP") {
		ctx.reply(ctx.command.toHelpEmbed(ctx.prefix));
	} else if (ctx.command) {
		ctx.command.execute(ctx, "DISCORD").then(() => log(ctx)).catch(err => {
			if (err.message === "INVALID_PERMISSIONS") {
				const embed = new EmbedBuilder()
					.setTitle("You are not allowed to use this.")
					.setDescription(`This command requires permissions that you do not currently have. Please check \`${ctx.prefix}?${(ctx.command as Command).name}\` for more information about the requirements to use this command.`)
					.setColor("Red");
				ctx.reply(embed);
			} else if (err.message === "NOT_NSFW_CHANNEL") {
				const embed = new EmbedBuilder()
					.setTitle("You are using this command incorrectly.")
					.setDescription("As this command shows NSFW content, you need to use this command in a NSFW channel.")
					.setColor("Red");
				ctx.reply(embed);
			} else if (err.message === "INVALID_ARGS") {
				ctx.error("INVALID_ARGS", `Please check \`${ctx.prefix}?${(ctx.command as Command).name}\` for more information on how to use this command.`);
			}
		});
	}
}

export async function revoltMessage(
	client: RevoltClient,
	message: RjsMessage
) {
	if (!message.content) return;

	const author = await client.users.fetchRevolt(message.author_id);
	const guild = message.channel?.server_id
		? await client.servers.fetchRevolt(message.channel.server_id)
		: null;
	const ctx = new RevoltMessageContext(author, client, message, guild);

	if (ctx.command && ctx.mode === "HELP") {
		ctx.reply("Support for help has not yet been implemented.");
	} else if (ctx.command) {
		ctx.command.execute(ctx, "REVOLT").then(() => log(ctx)).catch(err => {
			if (err.message === "INVALID_PERMISSIONS") {
				ctx.reply("You are not allowed to use this.");
			} else if (err.message === "NOT_NSFW_CHANNEL") {
				ctx.reply("You cannot use an NSFW command in a non-NSFW channel.");
			} else if (err.message === "INVALID_ARGS") {
				ctx.error("INVALID_ARGS", `Please check \`${ctx.prefix}?${(ctx.command as Command).name}\` for more information on how to use this command.`);
			}
		});
	}
}
