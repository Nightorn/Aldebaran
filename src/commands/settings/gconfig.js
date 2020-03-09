const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/SettingsCommand");

module.exports = class GconfigCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Manages the Aldebaran settings of your server",
			usage: "Parameter Value",
			example: "adventureTimer on",
			perms: { discord: ["ADMINISTRATOR"] }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const parametersAvailable = bot.models.settings.guild;
		if (args.length === 0) {
			const { prefix } = message.guild;
			const embed = new MessageEmbed()
				.setAuthor("User Settings", bot.user.avatarURL())
				.setDescription(
					`Welcome to your server settings! This command allows you to customize Aldebaran to your needs. The available properties are listed in \`${prefix}gconfig list\`, and your current settings are shown in \`${prefix}gconfig view\`. To change a property, you need to use this command like that: \`${prefix}gconfig property value\`, and one example is \`${prefix}gconfig adventureTimer on\`.`
				)
				.setColor("BLUE");
			message.channel.send({ embed });
		} else if (args.includes("list")) {
			const list = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (message.guild.members.cache.get(data.showOnlyIfBotIsInGuild)
					|| data.showOnlyIfBotIsInGuild === undefined) {
					if (list[data.category] === undefined) list[data.category] = {};
					list[data.category][key] = data;
				}
			}
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setTitle("Config Command Help Page")
				.setColor("BLUE");
			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters)) {
					entries += `**${key}** - ${data.help}\n`;
				}
				embed.addField(category, entries);
			}
			message.channel.send({ embed });
		} else if (args.includes("view")) {
			let list = "";
			for (const [key, value] of Object.entries(message.guild.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = new MessageEmbed()
				.setAuthor("Guild Settings  |  Overview", bot.user.avatarURL())
				.setDescription(list === "" ? "None" : list)
				.setColor("BLUE");
			message.channel.send({ embed });
		} else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
			if (parametersAvailable[args[0]].support(args[1])) {
				if (parametersAvailable[args[0]].postUpdate !== undefined) {
					/* eslint-disable no-param-reassign */
					parametersAvailable[args[0]].postUpdate(
						args[1],
						message.guild
					);
				}
				if (parametersAvailable[args[0]].postUpdateCommon !== undefined) {
					parametersAvailable[
						args[0]
					].postUpdateCommon(args[1], message.author, message.guild);
					/* eslint-enable no-param-reassign */
				}
				message.guild
					.changeSetting(args[0], args[1])
					.then(() => {
						const embed = new MessageEmbed()
							.setAuthor(message.author.username, message.author.avatarURL())
							.setTitle("Settings successfully changed")
							.setDescription(
								`The property **\`${
									args[0]
								}\`** has successfully been changed to the value **\`${
									args[1]
								}\`**.`
							)
							.setColor("GREEN");
						message.channel.send({ embed });
					})
					.catch(err => {
						const embed = new MessageEmbed()
							.setAuthor(message.author.username, message.author.avatarURL())
							.setTitle("An Error Occured")
							.setDescription(
								"An error occured and we could not change your settings. Please retry later."
							)
							.setColor("RED");
						message.channel.send({ embed });
						throw err;
					});
			} else {
				message.channel.send(
					"**Error** This value is not supported, check `&gconfig list` for more informations."
				);
			}
		} else {
			message.channel.send(
				"**Error** This key does not exist, check `&gconfig list` for more informations."
			);
		}
		return true;
	}
};
