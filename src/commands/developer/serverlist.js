const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/DeveloperCommand");

module.exports = class ServerlistCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Lists the servers Aldebaran is in",
			perms: { aldebaran: ["VIEW_SERVERLIST"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		let chunkIndex = 0;
		if (args[0] !== undefined)
			if (!Number.isNaN(parseInt(args[0], 10)))
				chunkIndex = parseInt(args[0], 10) - 1;
		const list = [];
		let chunk = 0;
		let guildIndex = 0;
		bot.guilds.cache.forEach(guild => {
			if (guildIndex === 20) {
				chunk++;
				guildIndex = 0;
			}
			if (list[chunk] === undefined) list[chunk] = "";
			list[chunk] += `\`${guild.id}\` **${guild.name}** - **${guild.memberCount}** members\n`;
			guildIndex++;
		});
		const embed = new MessageEmbed()
			.setAuthor("Aldebaran  |  Server List", bot.user.avatarURL())
			.setTitle(`Page ${chunkIndex + 1}`)
			.setDescription(list[chunkIndex])
			.setColor(this.color);
		message.channel.send({ embed });
	}
};
