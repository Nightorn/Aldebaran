import util from "util";
import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import Message from "../../../structures/djs/Message.js";
import User from "../../../structures/djs/User.js";
import Guild from "../../../structures/djs/Guild.js";

export default class ViewSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows detailled informations about the specified user or guild",
			subcommand: true,
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		const id = message.mentions.members!.size === 1
			? message.mentions.members!.first()!.id : args[1];
		bot.users.fetch(id).then(user => {
			const guilds = [];
			const embed = new MessageEmbed()
				.setAuthor(`${user.tag} | ${user.id}`, (user as User).pfp());
			if (Object.entries((user as User).settings).length !== 0) {
				embed.addField("Settings", `\`\`\`js\n${util.inspect((user as User).settings, false, null)}\`\`\``);
			}
			for (const [guildId, data] of bot.guilds.cache) {
				const member = data.members.cache.get(user.id);
				if (member) {
					let elevation = null;
					if (data.ownerID === user.id) elevation = "(Owner)";
					else if (member.permissions.has("ADMINISTRATOR"))
						elevation = "(Admin)";
					guilds.push(`\`${guildId}\` **${data.name}** ${elevation !== null ? elevation : ""}`);
				}
			}
			if (guilds.length > 0) embed.addField("Servers", guilds.join("\n"));
			message.channel.send({ embed });
		}).catch(() => {
			const guild = bot.guilds.cache.get(id) as Guild;
			if (guild !== undefined) {
				let adminsStr = "";
				const members = Array.from(guild.members.cache.values());
				const bots = members.filter(m => m.user.bot === true);
				const humans = members.filter(m => m.user.bot === false);
				const botRate = bots.length * 100 / members.length;
				const admins = members.filter(m => m.permissions.has("ADMINISTRATOR") && !m.user.bot && m.id !== m.guild.ownerID);
				for (const member of admins) {
					adminsStr += `\`${member.user.id}\` | **\`[${member.user.tag}]\`** <@${member.user.id}>\n`;
				}
				const embed = new MessageEmbed()
					.setAuthor(`${guild.name} | ${guild.id}`, guild.iconURL()!)
					.setDescription(`**Owner** : <@${guild.owner!.id}> **\`[${guild.owner!.user.tag}]\`**\n**Member Count** : ${humans.length} Members (+${bots.length} Bots / ${Math.floor(botRate)}%)`);
				if (Object.entries(guild.settings).length !== 0) embed.addField("Settings", `\`\`\`js\n${util.inspect(guild.settings, false, null)}\`\`\``);
				if (adminsStr !== "") embed.addField("Admins", admins);
				message.channel.send({ embed });
			} else {
				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.pfp())
					.setTitle("Warning")
					.setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user!.username} is.`)
					.setColor("ORANGE");
				message.channel.send({ embed });
			}
		});
	}
};
