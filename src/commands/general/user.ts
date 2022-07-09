import { MessageEmbed } from "discord.js";
import { getDateWithTimezone } from "../../utils/Methods.js";
import Command from "../../groups/Command.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class UserCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Shows detailled user information",
			example: "437802197539880970",
			args: { user: {
				as: "user",
				desc: "The user whose information you want to see",
				optional: true
			} },
            platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.client.users.fetchDiscord(args.user || ctx.author.id)
			.then(async user => {
				const allRoles = new Map();
				const rolesList = [];
				const allPermissions = [];
				let mjd = null;
				let memberNick = null;
				if (ctx.member) {
					mjd = new Date(ctx.member.joinedTimestamp!);
					memberNick = ctx.member.nickname === undefined
						? null : ctx.member.nickname;
					if (ctx.member.permissions.has("ADMINISTRATOR"))
						allPermissions.push("Administrator");
					else {
						for (let [name, value] of Object.entries(
							ctx.member.permissions.serialize()
						)) {
							if (value) {
								const splitName = name.toLowerCase().split("_");
								const words = [];
								for (const word of splitName)
									words.push(word[0].toUpperCase() + word.slice(1));
								allPermissions.push(words.join(" "));
							}
						}
					}
					for (const [id, data] of ctx.member.roles.cache)
						if (data.name !== "@everyone") allRoles.set(id, data.rawPosition);
					// eslint-disable-next-line func-names
					allRoles[Symbol.iterator] = function* () {
						yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
					};
					for (const [id] of allRoles) {
						if (rolesList.length > 39) break;
						rolesList.push(`<@&${id}>`);
					}
				}

				const getDate = (date: Date) => {
                    const dateformat = user.base.getSetting("dateformat");
                    const timezone = user.base.getSetting("timezone");
                    const format = dateformat
                        ? `**${dateformat}** [@] HH:mm`
                        : "**MM/DD/YYYY** [@] HH:mm"
					return getDateWithTimezone(date, `${format}`, timezone);
				};

				const guild = ctx.server
					? `${ctx.server.name}  |  Member Details`
					: "User Details";
				const embed = new MessageEmbed()
					.setAuthor({
						name: `${user.user.tag}  |  ${guild}`,
						iconURL: user.avatarURL
					})
					.setDescription(`**User ID** ${user.id}\n${memberNick !== null ? `**Nickname** ${memberNick}\n` : ""}`)
					.setThumbnail(user.avatarURL)
					.setColor(ctx.member ? ctx.member.displayColor : this.color)
					.setFooter({ text: "User account created on" })
					.setTimestamp(new Date(user.user.createdTimestamp));
				if (mjd !== null)
					embed.addField(
						"Server Join Date",
						`${getDate(mjd)} - ${
							ctx.author.id === user.id ? "You have" : "This user has"
						} been on this server for **${Math.floor(
							(Date.now() - mjd.getTime()) / 86400000
						)} days**.`
					);
				if (rolesList.length > 0)
					embed.addField(`Roles (${ctx.member!.roles.cache.size - 1})`, `${rolesList.join(", ")}`);
				if (allPermissions.length > 0)
					embed.addField("Permissions", allPermissions.join(", "));
				ctx.reply(embed);
			}).catch(() => ctx.error("INVALID_USER"));
	}
}
