import { Collection, Guild, Snowflake } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import { Command, Embed } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import { paginate } from "../../../utils/Methods.js";

export default class ServerlistSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists the servers the bot is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
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
				new Embed(this).setAuthor(`${ctx.client.name}  |  Server List`, ctx.client.user.avatarURL()!)
			);
		});
	}
};
