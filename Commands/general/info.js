const { MessageEmbed, version } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: "info",
			description: "Displays informations about Aldebaran"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message) {
		let adminMentions = "";
		for (const [id, member] of Object.entries(bot.config.aldebaranTeam)) {
			if (member.acknowledgements.includes("DEVELOPER")) { adminMentions += `<@${id}> as ${member.text}\n`; }
		}
		const embed = new MessageEmbed()
			.setAuthor(`${bot.user.username} v${bot.version}`, bot.user.avatarURL(), "https://aldebaran.nightorn.com/")
			.addField("Developers of Aldebaran", adminMentions, true)
			.addField(
				"Statistics",
				`Playing with **${Number.formatNumber(bot.guilds.size)} servers**\nWatching **${Number.formatNumber(bot.channels.size)} channels**\nListening to **${Number.formatNumber(bot.users.size)} users**`,
				true
			)
			.addField(
				"Powered by",
				`VPS Host **DigitalOcean**\nEnvironment **Node.js** ${process.version}\nAPI Library **discord.js** v${version}`,
				true
			)
			.addField(
				"Affiliation",
				"Aldebaran uses but is not affiliated with [DiscordRPG](https://discorddungeons.me), [TheCatAPI](https://thecatapi.com), [Dog API](https://dog.ceo/), [nekos.life](https://nekos.life/), [Giphy](https://giphy.com), [osu!](https://osu.ppy.sh), [Some Random Api](https://some-random-api.ml/) and [Pexels](https://www.pexels.com)."
			)
			.setFooter(`The prefix in this guild is "${message.guild.prefix}".`)
			.setThumbnail(bot.user.avatarURL())
			.setColor(message.guild.me.displayColor);
		message.channel.send({ embed });
	}
};
