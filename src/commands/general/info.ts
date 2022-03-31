import { MessageEmbed, version } from "discord.js";
import Command from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber } from "../../utils/Methods.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class InfoCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays information about the bot"
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
			.setAuthor({
				name: `${ctx.client.name} v${ctx.client.version}`,
				iconURL: ctx.client.user.avatarURL()!,
				url: process.env.HOMEPAGE
			})
			.addField(`Developers of ${ctx.client.name}`, adminMentions)
			.addField(
				"Statistics",
				`Playing with **${guilds} servers**\nWatching **${channels} channels**\nListening to **${users} users**`,
				true
			)
			.addField(
				"Powered by",
				`Host **Raspberry Pi 4 8GB**\nEnvironment **Node.js** ${process.version}\nAPI Library **discord.js** v${version}`,
				true
			)
			.addField(
				"Affiliation",
				`${ctx.client.name} uses but is not affiliated with [DiscordRPG](https://discorddungeons.me), [TheCatAPI](https://thecatapi.com), [Dog API](https://dog.ceo/), [nekos.life](https://nekos.life/), [Giphy](https://giphy.com), [osu!](https://osu.ppy.sh), [Some Random Api](https://some-random-api.ml/) and [Pexels](https://www.pexels.com).`
			)
			.addField("Privacy Policy", "As of now, if Aldebaran has read permissions in a channel, it can read all messages inside it. Because Discord now requires Discord bot developers to be transparent about how they use messages' content, you should know about [Aldebaran's Privacy Policy](https://aldebaran.ciborn.dev/privacy-policy).")
			.setThumbnail(ctx.client.user.avatarURL()!)
			.setColor(ctx.guild ? ctx.guild.guild.me!.displayColor : "BLUE");
		if (ctx.guild) {
			embed.setFooter({ text: `The prefix in this guild is "${ctx.prefix}".` });
		}
		ctx.reply(embed);
	}
}
