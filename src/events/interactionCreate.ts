import { Interaction } from "discord.js";
import Context from "../structures/contexts/DiscordSlashMessageContext.js";
import AldebaranClient from "../structures/djs/Client";

export default async (client: AldebaranClient, interaction: Interaction) => {
	if (interaction.isCommand()) {
		const author = await client.customUsers.fetch(interaction.user.id);
		const guild = interaction.guild
			? await client.customGuilds.fetch(interaction.guild.id)
			: undefined;
		const ctx = new Context(client, interaction, author, guild);
		ctx.command.execute(ctx, "DISCORD_SLASH");
	}
};