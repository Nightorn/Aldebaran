import util from "util";
import Command from "../../../groups/DeveloperCommand.js";
import DiscordContext from "../../../structures/contexts/DiscordContext.js";
import Embed from "../../../structures/Embed.js";

export default class ViewSubcommand extends Command {
	constructor() {
		super({
			description: "Shows detailled information about the specified user or guild",
			perms: { aldebaran: ["EDIT_USERS"] },
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordContext) {
		const [id] = ctx.args as string[];
		ctx.fetchUser(id).then(async user => {
			const guilds = [];
			const embed = new Embed()
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
					} else if (member.permissions.has("Administrator")) {
						elevation = "(Admin)";
					}
					guilds.push(`\`${guildId}\` **${data.name}** ${elevation !== null ? elevation : ""}`);
				}
			}
			if (guilds.length > 0) embed.addField("Servers", guilds.join("\n"));
			ctx.reply(embed);
		}).catch(async () => {
			const guild = await ctx.fetchServer(id);
			const settings = guild.base.settings;
			if (ctx.server) {
				const owner = await ctx.server.guild.fetchOwner();
				const embed = new Embed()
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
