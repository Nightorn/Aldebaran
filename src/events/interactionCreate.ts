import { Interaction } from "discord.js";
import Context from "../structures/contexts/DiscordSlashMessageContext.js";
import DiscordClient from "../structures/DiscordClient.js";

export default async (client: DiscordClient, interaction: Interaction) => {
	if (interaction.isCommand()) {
		const guild = interaction.guild
			? await client.servers.fetchDiscord(interaction.guild.id)
			: null;
		const author = await client.users.fetchDiscord(interaction.user.id);

		const ctx = new Context(client, interaction, author, guild);
		ctx.command.execute(ctx, "DISCORD_SLASH");
	}
};
