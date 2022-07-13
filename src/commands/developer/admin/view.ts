import util from "util";
import { MessageEmbed } from "discord.js";
import Command from "../../../groups/DeveloperCommand.js";
import Client from "../../../structures/Client.js";
import DiscordMessageContext from "../../../structures/contexts/DiscordMessageContext.js";

export default class ViewSubcommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Shows detailled information about the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] },
			platforms: ["DISCORD"]
		});
	}

	async run(ctx: DiscordMessageContext) {
		const args = ctx.args as string[];
		const id = ctx.mentions.users.first()?.id ?? args[0];
		ctx.client.users.fetchDiscord(id).then(async user => {
			const guilds = [];
			const embed = new MessageEmbed()
				.setAuthor({
					name: `${user.tag} | ${user.id}`,
					iconURL: user.avatarURL
				});
			if (Object.entries(user.base.settings).length !== 0) {
				embed.addField("Settings", `\`\`\`js\n${util.inspect(user.base.settings, false, null)}\`\`\``);
			}
			for (const [guildId, data] of ctx.client.discord.guilds.cache) {
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
			const guild = await ctx.client.guilds.fetchDiscord(id);
			const settings = guild.base.settings;
			if (ctx.server) {
				const owner = await ctx.server.guild.fetchOwner();
				const embed = new MessageEmbed()
					.setAuthor({
						name: `${ctx.server.guild.name} | ${ctx.server.id}`,
						iconURL: ctx.server.guild.iconURL() || undefined
					})
					.setDescription(`**Owner** : <@${ctx.server.guild.ownerId}> **\`[${owner.user.tag}]\`**\n**Member Count** : ${guild.guild.memberCount} Members`);
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
}
