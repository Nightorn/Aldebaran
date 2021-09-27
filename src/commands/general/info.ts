import { MessageEmbed, version } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber } from "../../utils/Methods.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class InfoCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays informations about Aldebaran"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		let adminMentions = "";
		for (const [id, member] of Object.entries(ctx.client.config.aldebaranTeam)) {
			if (member.acknowledgements.includes("DEVELOPER")) { adminMentions += `<@${id}>, ${member.text}\n`; }
		}

		const guilds = formatNumber((await ctx.client.shard!
			.broadcastEval(c => c.guilds.cache.size))
			.reduce((acc, cur) => acc + cur));

		const users = formatNumber((await ctx.client.shard!
			.broadcastEval(c => c.users.cache.size))
			.reduce((acc, cur) => acc + cur));

		const channels = formatNumber((await ctx.client.shard!
			.broadcastEval(c => c.channels.cache.size))
			.reduce((acc, cur) => acc + cur));

		const embed = new MessageEmbed()
			.setAuthor(
				`${ctx.client.user.username} v${ctx.client.version}`,
				ctx.client.user.avatarURL()!,
				"https://aldebaran.nightorn.com/"
			)
			.addField("Developers of Aldebaran", adminMentions)
			.addField(
				"Statistics",
				`Playing with **${guilds} servers**\nWatching **${channels} channels**\nListening to **${users} users**`,
				true
			)
			.addField(
				"Powered by",
				`VPS Host **Contabo**\nEnvironment **Node.js** ${process.version}\nAPI Library **discord.js** v${version}`,
				true
			)
			.addField(
				"Affiliation",
				"Aldebaran uses but is not affiliated with [DiscordRPG](https://discorddungeons.me), [TheCatAPI](https://thecatapi.com), [Dog API](https://dog.ceo/), [nekos.life](https://nekos.life/), [Giphy](https://giphy.com), [osu!](https://osu.ppy.sh), [Some Random Api](https://some-random-api.ml/) and [Pexels](https://www.pexels.com)."
			)
			.setFooter(`The prefix in this guild is "${ctx.prefix}".`)
			.setThumbnail(ctx.client.user.avatarURL()!)
			.setColor(ctx.message.guild ? ctx.message.guild.me!.displayColor : "BLUE");
		ctx.reply(embed);
	}
};
