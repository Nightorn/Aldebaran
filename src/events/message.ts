import { Message as DjsMessage } from "discord.js";
import { Message as RjsMessage } from "revolt.js";
import DiscordClient from "../structures/DiscordClient.js";
import RevoltClient from "../structures/RevoltClient.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import RevoltMessageContext from "../structures/contexts/RevoltMessageContext.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import { drpgIDs } from "../utils/Constants.js";

const allowNonSlash = process.env.ALLOW_NON_SLASH_COMMANDS;
const drpgCommands = ["mine", "forage", "fish", "chop"];

export async function discordMessage(
	client: DiscordClient,
	message: DjsMessage
) {
	const isDrpgCommand = drpgIDs.includes(message.author.id)
		&& message.interaction?.commandName
		&& drpgCommands.includes(message.interaction?.commandName);

	const hasMention = message.mentions.users.has(client.discord.user.id);
	if (
		(!hasMention && !allowNonSlash && !isDrpgCommand)
		|| (message.webhookId && !message.interaction)
		|| (message.author.bot && !isDrpgCommand)
	) return;

	const guild = message.guild
		? await client.servers.fetchDiscord(message.guild.id)
		: null;

	const author = await client.users.fetchDiscord(message.author.id);
	const ctx = new DiscordMessageContext(author, client, message, guild);

	if (isDrpgCommand) {
		return DRPGSides(ctx as unknown as DiscordMessageContext<true>);
	}

	if (ctx.content.indexOf(ctx.prefix) !== 0) return;

	if (ctx.command && ctx.mode === "HELP") {
		ctx.reply(ctx.command.toHelpEmbed(ctx.prefix));
	} else if (ctx.command) {
		ctx.command.execute(ctx, "DISCORD");
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

	if ((ctx.content as string).indexOf(ctx.prefix) !== 0) return;

	if (ctx.command && ctx.mode === "HELP") {
		ctx.reply("Support for help has not yet been implemented.");
	} else if (ctx.command) {
		ctx.command.execute(ctx, "REVOLT");
	}
}
