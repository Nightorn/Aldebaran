import { Collection, Guild } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import Client from "../../../structures/Client.js";
import { paginate } from "../../../utils/Methods.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../../structures/contexts/DiscordSlashMessageContext.js";

type Guilds = Collection<string, Guild>[];

export default class ServerlistSubcommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Lists the servers the bot is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordMessageContext | DiscordSlashMessageContext) {
		const shard = ctx.client.discord.shard;
		const guilds = shard
			? (await shard.fetchClientValues("guilds.cache") as Guilds)
				.reduce((acc: Guild[], cur) => [...acc, ...Array.from(cur.values())], [])
			: Array.from(ctx.client.discord.guilds.cache.values());
		
		const list: string[] = [];
		guilds.forEach(guild => {
			list.push(`\`${guild.id}\` **${guild.name}** - **${guild.memberCount}** members`);
		});
			
		const embed = this.createEmbed(ctx).setAuthor({
			name: `${ctx.client.name}  |  Server List`,
			iconURL: ctx.client.discord.user.displayAvatarURL()
		});
		paginate(list, 15, "Server List", ctx, undefined, embed);
	}
}
