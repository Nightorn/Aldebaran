import { Collection, Guild } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import Client from "../../../structures/Client.js";
import { paginate } from "../../../utils/Methods.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../../structures/contexts/DiscordSlashMessageContext.js";

export default class ServerlistSubcommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Lists the servers the bot is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordMessageContext | DiscordSlashMessageContext) {
		const list: string[] = [];
		ctx.client.discord.shard!.fetchClientValues("guilds.cache").then(collected => {
			(collected as Collection<string, Guild>[])
				.reduce((a: Guild[], c) => [...a, ...Array.from(c.values())], [])
				.forEach((guild: Guild) => {
					list.push(`\`${guild.id}\` **${guild.name}** - **${guild.memberCount}** members`);
				});
			
			paginate(
				list,
				15,
				"Server List",
				ctx,
				undefined,
				this.createEmbed(ctx).setAuthor({
					name: `${ctx.client.name}  |  Server List`,
					iconURL: ctx.client.discord.user!.avatarURL()!
				})
			);
		});
	}
}
