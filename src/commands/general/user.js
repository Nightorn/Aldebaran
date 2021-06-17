import { MessageEmbed } from "discord.js";
import { getDateWithTimezone } from "../../utils/Methods.js";
import { Command } from "../../groups/Command.js";

export default class UserCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows detailled user informations",
			usage: "UserMention/UserID",
			example: "437802197539880970",
			args: { user: { as: "user" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		bot.users.fetch(args.user || message.author.id).then(user => {
			const member = message.guild.members.cache.get(user.id);
			const allRoles = new Map();
			const rolesList = [];
			const allPermissions = [];
			let mjd = null;
			let memberNick = null;
			if (member !== undefined) {
				mjd = new Date(member.joinedTimestamp);
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
							name = name.toLowerCase().split("_");
							const words = [];
							for (const word of name)
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

			const getDate = date => {
				const { dateFormat } = message.author.settings;
				return getDateWithTimezone(
					date,
					`${
						dateFormat !== undefined
							? `**${dateFormat}** [@] HH:mm`
							: "**MM/DD/YYYY** [@] HH:mm"
					}`,
					message.author.settings.timezone
				);
			};

			const embed = new MessageEmbed()
				.setAuthor(
					`${user.tag}  |  ${member !== undefined ? `${message.guild.name}  |  Member Details` : "User Details"}`,
					user.avatarURL()
				)
				.setDescription(`**User ID** ${user.id}\n${memberNick !== null ? `**Nickname** ${memberNick}\n` : ""}`)
				.setThumbnail(user.avatarURL())
				.setColor(member !== undefined ? member.displayColor : this.color)
				.setFooter("User account created on")
				.setTimestamp(new Date(user.createdTimestamp));
			if (mjd !== null)
				embed.addField(
					"Server Join Date",
					`${getDate(mjd)} - ${
						message.author.id === user.id ? "You have" : "This user has"
					} been on this server for **${Math.floor(
						(Date.now() - mjd.getTime()) / 86400000
					)} days**.`
				);
			if (rolesList.length > 0)
				embed.addField(`Roles (${member.roles.cache.size - 1})`, `${rolesList.join(", ")}`);
			if (allPermissions.length > 0)
				embed.addField("Permissions", allPermissions.join(", "));
			message.channel.send({ embed });
		}).catch(() => { message.channel.error("INVALID_USER"); });
	}
};
