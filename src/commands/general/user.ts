import { MessageEmbed } from "discord.js";
import { getDateWithTimezone } from "../../utils/Methods.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class UserCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows detailled user informations",
			usage: "UserMention/UserID",
			example: "437802197539880970",
			args: { user: { as: "user", optional: true } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.client.customUsers.fetch(args.user || ctx.message.author.id)
			.then(async user => {
				const allRoles = new Map();
				const rolesList = [];
				const allPermissions = [];
				let mjd = null;
				let memberNick = null;
				const member = ctx.message.guild
					? await ctx.message.guild.members.fetch(user.id)
					: null;
				if (member) {
					mjd = new Date(member.joinedTimestamp!);
					memberNick = member.nickname === undefined
						? null : member.nickname;
					if (member.permissions.has("ADMINISTRATOR"))
						allPermissions.push("Administrator");
					else {
						// eslint-disable-next-line prefer-const
						for (let [name, value] of Object.entries(
							member.permissions.serialize()
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
					for (const [id, data] of member.roles.cache)
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
					const { dateformat } = user.settings;
					return getDateWithTimezone(
						date,
						`${
							dateformat !== undefined
								? `**${dateformat}** [@] HH:mm`
								: "**MM/DD/YYYY** [@] HH:mm"
						}`,
						user.settings.timezone
					);
				};

				const embed = new MessageEmbed()
					.setAuthor(
						`${user.user.tag}  |  ${member ? `${ctx.message.guild!.name}  |  Member Details` : "User Details"}`,
						user.user.displayAvatarURL()
					)
					.setDescription(`**User ID** ${user.id}\n${memberNick !== null ? `**Nickname** ${memberNick}\n` : ""}`)
					.setThumbnail(user.user.displayAvatarURL())
					.setColor(member ? member.displayColor : this.color)
					.setFooter("User account created on")
					.setTimestamp(new Date(user.user.createdTimestamp));
				if (mjd !== null)
					embed.addField(
						"Server Join Date",
						`${getDate(mjd)} - ${
							ctx.message.author.id === user.id ? "You have" : "This user has"
						} been on this server for **${Math.floor(
							(Date.now() - mjd.getTime()) / 86400000
						)} days**.`
					);
				if (rolesList.length > 0)
					embed.addField(`Roles (${member!.roles.cache.size - 1})`, `${rolesList.join(", ")}`);
				if (allPermissions.length > 0)
					embed.addField("Permissions", allPermissions.join(", "));
				ctx.reply(embed);
			}).catch(() => ctx.error("INVALID_USER"));
	}
};
