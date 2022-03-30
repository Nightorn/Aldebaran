import util from "util";
import { MessageEmbed } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import AldebaranClient from "../../../structures/djs/Client.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default class ViewSubcommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows detailled information about the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] },
			platforms: ["DISCORD"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: DiscordMessageContext) {
		const args = ctx.args as string[];
		const id = ctx.mentions.members!.size === 1
			? ctx.mentions.members!.first()!.id : args[0];
		ctx.client.customUsers.fetch(id).then(async user => {
			const guilds = [];
			const embed = new MessageEmbed()
				.setAuthor({
					name: `${user.user.tag} | ${user.id}`,
					iconURL: user.user.displayAvatarURL()
				});
			if (Object.entries(user.settings).length !== 0) {
				embed.addField("Settings", `\`\`\`js\n${util.inspect(user.settings, false, null)}\`\`\``);
			}
			for (const [guildId, data] of ctx.client.guilds.cache) {
				const member = await data.members.fetch(user.id);
				if (member) {
					let elevation = null;
					if (data.ownerId === user.id) {
						elevation = "(Owner)";
					} else if (member.permissions.has("ADMINISTRATOR")) {
						elevation = "(Admin)";
					}
					guilds.push(`\`${guildId}\` **${data.name}** ${elevation !== null ? elevation : ""}`);
				}
			}
			if (guilds.length > 0) embed.addField("Servers", guilds.join("\n"));
			ctx.reply(embed);
		}).catch(async () => {
			const guild = await ctx.client.customGuilds.fetch(id);
			const settings = guild.settings;
			if (ctx.guild) {
				const owner = await ctx.guild.guild.fetchOwner();
				const embed = new MessageEmbed()
					.setAuthor({
						name: `${ctx.guild.guild.name} | ${ctx.guild.id}`,
						iconURL: ctx.guild.guild.iconURL()!
					})
					.setDescription(`**Owner** : <@${ctx.guild.guild.ownerId}> **\`[${owner.user.tag}]\`**\n**Member Count** : ${guild.guild.memberCount} Members`);
				if (Object.entries(settings).length !== 0) {
					embed.addField("Settings", `\`\`\`js\n${util.inspect(settings, false, null)}\`\`\``);
				}
				ctx.reply(embed);
			} else {
				ctx.error(
					"NOT_FOUND",
					`The ID specified does not correspond to a valid user or a guild where ${ctx.client.name} is.`
				);
			}
		});
	}
};
