import { Collection, Guild, Snowflake } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import { paginate } from "../../../utils/Methods.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../../structures/contexts/DiscordSlashMessageContext.js";

export default class ServerlistSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists the servers the bot is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: DiscordMessageContext | DiscordSlashMessageContext) {
		const list: string[] = [];
		ctx.client.shard!.fetchClientValues("guilds.cache").then(collected => {
			(collected as Collection<Snowflake, Guild>[])
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
					iconURL: ctx.client.user.avatarURL()!
				})
			);
		});
	}
}
