import util from "util";
import { MessageEmbed } from "discord.js";
import { Command } from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import MessageContext from "../../../structures/aldebaran/MessageContext.js";

export default class ViewSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows detailled information about the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const id = ctx.message.mentions.members!.size === 1
			? ctx.message.mentions.members!.first()!.id : args[0];
		ctx.client.customUsers.fetch(id).then(async user => {
			const guilds = [];
			const embed = new MessageEmbed()
				.setAuthor(`${user.user.tag} | ${user.id}`, user.user.displayAvatarURL());
			if (Object.entries(user.settings).length !== 0) {
				embed.addField("Settings", `\`\`\`js\n${util.inspect(user.settings, false, null)}\`\`\``);
			}
			for (const [guildId, data] of ctx.client.guilds.cache) {
				const member = await data.members.fetch(user.id);
				if (member) {
					let elevation = null;
					if (data.ownerId === user.id) elevation = "(Owner)";
					else if (member.permissions.has("ADMINISTRATOR"))
						elevation = "(Admin)";
					guilds.push(`\`${guildId}\` **${data.name}** ${elevation !== null ? elevation : ""}`);
				}
			}
			if (guilds.length > 0) embed.addField("Servers", guilds.join("\n"));
			ctx.reply(embed);
		}).catch(async () => {
			const customGuild = await ctx.client.customGuilds.fetch(id);
			const settings = customGuild.settings;
			if (ctx.message.guild) {
				let adminsStr = "";
				const members = Array.from(ctx.message.guild.members.cache.values());
				const bots = members.filter(m => m.user.bot === true);
				const humans = members.filter(m => m.user.bot === false);
				const botRate = bots.length * 100 / members.length;
				const admins = members.filter(m => m.permissions.has("ADMINISTRATOR") && !m.user.bot && m.id !== m.guild.ownerId);
				for (const member of admins) {
					adminsStr += `\`${member.user.id}\` | **\`[${member.user.tag}]\`** <@${member.user.id}>\n`;
				}
				const owner = await ctx.message.guild.fetchOwner();
				const embed = new MessageEmbed()
					.setAuthor(`${ctx.message.guild.name} | ${ctx.message.guild.id}`, ctx.message.guild.iconURL()!)
					.setDescription(`**Owner** : <@${ctx.message.guild.ownerId}> **\`[${owner.user.tag}]\`**\n**Member Count** : ${humans.length} Members (+${bots.length} Bots / ${Math.floor(botRate)}%)`);
				if (Object.entries(settings).length !== 0) embed.addField("Settings", `\`\`\`js\n${util.inspect(settings, false, null)}\`\`\``);
				if (adminsStr !== "") embed.addField("Admins", adminsStr);
				ctx.reply(embed);
			} else {
				const embed = new MessageEmbed()
					.setAuthor(
						ctx.message.author.username,
						ctx.message.author.displayAvatarURL()
					)
					.setTitle("Warning")
					.setDescription(`The ID specified does not correspond to a valid user or a guild where ${ctx.client.name} is.`)
					.setColor("ORANGE");
				ctx.reply(embed);
			}
		});
	}
};
