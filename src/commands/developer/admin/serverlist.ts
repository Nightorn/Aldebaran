import { Collection, Guild } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import { paginate } from "../../../utils/Methods.js";
import DiscordContext from "../../../structures/contexts/DiscordContext.js";

type Guilds = Collection<string, Guild>[];

export default class ServerlistSubcommand extends Command {
	constructor() {
		super({
			description: "Lists the servers the bot is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordContext) {
		const shard = ctx.client.discord.shard;
		const guilds = shard
			? (await shard.fetchClientValues("guilds.cache") as Guilds)
				.reduce((acc: Guild[], cur) => [...acc, ...Array.from(cur.values())], [])
			: Array.from(ctx.client.discord.guilds.cache.values());
		
		const list: string[] = [];
		guilds.forEach(guild => {
			list.push(`\`${guild.id}\` **${guild.name}** - **${guild.memberCount}** members`);
		});
			
		const embed = this.createEmbed().setAuthor({
			name: `${ctx.client.name}  |  Server List`,
			iconURL: ctx.client.discord.user.displayAvatarURL()
		}).toDiscordEmbed();
		paginate(list, 15, "Server List", ctx, undefined, embed);
	}
}
