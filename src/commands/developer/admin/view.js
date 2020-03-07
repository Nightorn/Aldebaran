const util = require("util");
const { MessageEmbed } = require("discord.js");
const { Command } = require("../../../groups/DeveloperCommand");

module.exports = class ViewSubcommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows detailled informations about the specified user or guild",
			subcommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const id = message.mentions.members.size === 1
			? message.mentions.members.first().id : args[1];
		bot.users.fetch(id).then(user => {
			const guilds = [];
			const embed = new MessageEmbed()
				.setAuthor(`${user.tag} | ${user.id}`, user.avatarURL());
			if (Object.entries(user.settings) !== 0) embed.addField("Settings", `\`\`\`js\n${util.inspect(user.settings, false, null)}\`\`\``);
			for (const [guildId, data] of bot.guilds)
				if (data.members.get(user.id) !== undefined) {
					let elevation = null;
					if (data.ownerID === user.id) elevation = "(Owner)";
					else if (data.members.get(user.id).permissions.has("ADMINISTRATOR"))
						elevation = "(Admin)";
					guilds.push(`\`${guildId}\` **${data.name}** ${elevation !== null ? elevation : ""}`);
				}
			if (guilds.length > 0) embed.addField("Servers", guilds.join("\n"));
			message.channel.send({ embed });
		}).catch(() => {
			const guild = bot.guilds.get(id);
			if (guild !== undefined) {
				let admins = "";
				guild.bots = guild.members.filter(m => m.user.bot === true);
				guild.humans = guild.members.filter(m => m.user.bot === false);
				guild.botRate = guild.bots.size * 100 / guild.members.size;
				guild.admins = guild.members.filter(m => m.permissions.has("ADMINISTRATOR") && !m.user.bot && m.id !== m.guild.ownerID);
				for (const [, member] of guild.admins) admins += `\`${member.user.id}\` | **\`[${member.user.tag}]\`** <@${member.user.id}>\n`;
				const embed = new MessageEmbed()
					.setAuthor(`${guild.name} | ${guild.id}`, guild.iconURL())
					.setDescription(`**Owner** : <@${guild.owner.id}> **\`[${guild.owner.user.tag}]\`**\n**Member Count** : ${guild.humans.size} Members (+${guild.bots.size} Bots / ${Math.floor(guild.botRate)}%)`);
				if (Object.entries(guild.settings) !== 0) embed.addField("Settings", `\`\`\`js\n${util.inspect(guild.settings, false, null)}\`\`\``);
				if (admins !== "") embed.addField("Admins", admins);
				message.channel.send({ embed });
			} else {
				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setTitle("Warning")
					.setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
					.setColor("ORANGE");
				message.channel.send({ embed });
			}
		});
	}
};
