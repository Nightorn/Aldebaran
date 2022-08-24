import { Message, PartialMessage } from "discord.js";
import DiscordClient from "../structures/DiscordClient.js";
import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import { drpgIDs } from "../utils/Constants.js";

export default async (
	client: DiscordClient,
	message: Message<boolean> | PartialMessage
) => {
	if (!message.author || !drpgIDs.includes(message.author.id)) return;

	const cleanMessage = await message.channel.messages.fetch(message.id);

	const guild = message.guild
		? await client.servers.fetchDiscord(message.guild.id)
		: null;

	const author = await client.users.fetchDiscord(cleanMessage.author.id);
	const ctx = new DiscordMessageContext(author, client, cleanMessage, guild);

	const drpgCommand = ctx.interaction?.commandName;
	const serverCtx = ctx as unknown as DiscordMessageContext<true>;
	if (drpgCommand) {
		DiscordRPG(ctx);
		if (drpgCommand === "adv") {
			DRPGAdventure(serverCtx);
		} else if (drpgCommand === "padv")  {
			DRPGPadventure(serverCtx);
		}
	}
};
