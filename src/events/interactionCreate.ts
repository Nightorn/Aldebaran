import { Interaction } from "discord.js";
import Context from "../structures/contexts/DiscordSlashMessageContext.js";
import Client from "../structures/Client.js";

export default async (client: Client, interaction: Interaction) => {
	if (interaction.isCommand()) {
		const guild = interaction.guild
			? await client.guilds.fetchDiscord(interaction.guild.id)
			: null;
		const author = await client.users.fetchDiscord(interaction.user.id);

		const ctx = new Context(client, interaction, author, guild);
		ctx.command.execute(ctx, "DISCORD_SLASH");
	}
};
