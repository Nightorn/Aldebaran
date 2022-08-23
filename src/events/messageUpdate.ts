import { Message, PartialMessage } from "discord.js";
import DiscordClient from "../structures/DiscordClient.js";
import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";

const drpgIDs = ["170915625722576896", "891614347015626762"];

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
		if (drpgCommand === "adv") {
			DiscordRPG(ctx);
			DRPGAdventure(serverCtx);
		} else if (drpgCommand === "padv")  {
			DiscordRPG(ctx);
			DRPGPadventure(serverCtx);
		} else if (["mine", "forage", "fish", "chop"].includes(drpgCommand)) {
			DRPGSides(serverCtx);
		}
	}
};
