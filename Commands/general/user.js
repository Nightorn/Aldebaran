const { MessageEmbed } = require("discord.js");
const userCheck = require("./../../functions/action/userCheck");
const getDateWithTimezone = require("../../functions/utils/getDateWithTimezone");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class UserCommand extends Command {
	constructor(client) {
		super(client, {
			name: "user",
			description: "Shows detailled user informations",
			usage: "UserMention/UserID",
			example: "437802197539880970"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		userCheck(bot, message, args)
			.then(async userId => {
				bot.guilds
					.get(message.guild.id)
					.members.fetch({ user: userId })
					.then(user => {
						const allRoles = new Map();
						const rolesList = [];
						const allPermissions = [];
						const mjd = new Date(user.joinedTimestamp);
						if (user.permissions.has("ADMINISTRATOR"))
							allPermissions.push("Administrator");
						else {
							/* eslint-disable prefer-const */
							for (let [name, value] of Object.entries(
								user.permissions.serialize()
							)) {
								if (value) {
									name = name.toLowerCase().split("_");
									const words = [];
									for (const word of name)
										words.push(word[0].toUpperCase() + word.slice(1));
									allPermissions.push(words.join(" "));
								}
							}
							/* eslint-enable prefer-const */
						}
						for (const [id, data] of user.roles)
							if (data.name !== "@everyone") allRoles.set(id, data.rawPosition);
						/* eslint-disable func-names */
						allRoles[Symbol.iterator] = function* () {
							/* eslint-enable func-names */
							yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
						};
						for (const [id] of allRoles) rolesList.push(`<@&${id}>`);

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

						const { highestPerm } = user.user;
						const embed = new MessageEmbed()
							.setAuthor(
								`${user.user.tag}  |  ${message.guild.name}  |  Member Details`,
								user.user.avatarURL()
							)
							.setDescription(
								`**User ID** ${user.user.id}\n**Nickname** ${
									user.displayName
								}\n${
									highestPerm !== null
										? `*This user is a member of the Aldebaran staff (${highestPerm.slice(0, 1)
											+ highestPerm.toLowerCase().slice(1)}).*`
										: ""
								}`
							)
							.addField(
								"Server Join Date",
								`${getDate(mjd)} - ${
									message.author.id === user.id ? "You have" : "This user has"
								} been on this server for **${Math.floor(
									(Date.now() - mjd.getTime()) / 86400000
								)} days**.`
							)
							.addField("Roles", `${rolesList.join(", ")}`)
							.addField("Permissions", allPermissions.join(", "))
							.setThumbnail(user.user.avatarURL())
							.setColor(user.displayColor)
							.setFooter("User account created on")
							.setTimestamp(new Date(user.user.createdTimestamp));
						message.channel.send({ embed });
					})
					.catch(err => {
						message.channel.send(
							"Oops, looks like we got an error when fetching the requested data..."
						);
						throw err;
					});
			})
			.catch(err => {
				throw err;
			});
	}
};
