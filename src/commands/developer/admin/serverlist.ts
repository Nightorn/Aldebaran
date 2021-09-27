import { Collection, Guild, MessageEmbed, Snowflake } from "discord.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";

export default class ServerlistSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Lists the servers Aldebaran is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		let chunkIndex = 0;
		if (args[0] !== undefined)
			if (!Number.isNaN(parseInt(args[0], 10)))
				chunkIndex = parseInt(args[0], 10) - 1;
		const list: string[] = [];
		let chunk = 0;
		let guildIndex = 0;
		ctx.client.shard!.fetchClientValues("guilds.cache").then(collected => {
			(collected as Collection<Snowflake, Guild>[])
				.reduce((a: Guild[], c) => [...a, ...Array.from(c.values())], [])
				.forEach((guild: Guild) => {
					if (guildIndex === 20) {
						chunk++;
						guildIndex = 0;
					}
					if (list[chunk] === undefined) list[chunk] = "";
					list[chunk] += `\`${guild.id}\` **${guild.name}** - **${guild.memberCount}** members\n`;
					guildIndex++;

					const embed = new MessageEmbed()
						.setAuthor("Aldebaran  |  Server List", ctx.client.user.avatarURL()!)
						.setTitle(`Page ${chunkIndex + 1}`)
						.setDescription(list[chunkIndex])
						.setColor(this.color);
					ctx.reply(embed);
				});
		});
	}
};
