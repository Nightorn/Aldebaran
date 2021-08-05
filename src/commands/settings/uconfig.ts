import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { SettingsModel } from "../../utils/Constants.js";

export default class UconfigCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Manages your Aldebaran personal settings",
			usage: "Parameter Value",
			example: "adventureTimer on"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot: AldebaranClient, message: Message, args: any) {
		const parametersAvailable = SettingsModel.user;
		if (args.length === 0) {
			const { prefix } = message.guild;
			const embed = new MessageEmbed()
				.setAuthor("User Settings", bot.user!.avatarURL()!)
				.setDescription(
					`Welcome to your user settings! This command allows you to customize Aldebaran to your needs. The available properties are listed in \`${prefix}uconfig list\`, and your current settings are shown in \`${prefix}uconfig view\`. To change a property, you need to use this command like that: \`${prefix}uconfig property value\`, and one example is \`${prefix}uconfig adventureTimer on\`.`
				)
				.setColor("BLUE")
				.setFooter(
					`Make sure to also use \`${prefix}gconfig\` for server settings.`
				);
			message.channel.send({ embed });
		} else if (args.includes("list")) {
			const list: any = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (list[data.category] === undefined) list[data.category] = {};
				if (data.showOnlyIfBotIsInGuild !== undefined) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await message.guild.members.fetch(data.showOnlyIfBotIsInGuild);
					} catch {} // eslint-disable-line no-empty
				} else {
					list[data.category][key] = data;
				}
			}
			const embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.pfp())
				.setTitle("Config Command Help Page")
				.setDescription(
					"**__IMPORTANT: If setting is disabled in &gconfig by server owner, it will be ignored.__** If a server setting is undefined, a :warning: icon will appear in front of the concerned properties."
				)
				.setColor("BLUE");
			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters as any)) {
					if (
						message.guild.settings[key] === undefined
						&& bot.models.settings.guild[key] !== undefined
					) entries += ":warning: ";
					entries += `**${key}** - ${(data as any).help}\n`;
				}
				embed.addField(category, entries);
			}
			message.channel.send({ embed });
		} else if (args.includes("view")) {
			let list = "";
			for (const [key, value] of Object.entries(message.author.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = new MessageEmbed()
				.setAuthor("User Settings  |  Overview", bot.user!.avatarURL()!)
				.setDescription(list === "" ? "None" : list)
				.setColor("BLUE");
			message.channel.send({ embed });
		} else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
			if (parametersAvailable[args[0]].support(args[1])) {
				message.author
					.changeSetting(args[0], args[1])
					.then(() => {
						if (parametersAvailable[args[0]].postUpdate) {
							/* eslint-disable no-param-reassign */
							parametersAvailable[args[0]].postUpdate!(
								args[1],
								message.author,
								message.guild
							);
						}
						if (parametersAvailable[args[0]].postUpdate) {
							parametersAvailable[args[0]]
								.postUpdate!(args[1], message.author, message.guild);
							/* eslint-disable no-param-reassign */
						}
						const embed = new MessageEmbed()
							.setAuthor(message.author.username, message.author.pfp())
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
							.setAuthor(message.author.username, message.author.pfp())
							.setTitle("An Error Occured")
							.setDescription(
								"An error occured and we could not change your settings. Please retry later."
							)
							.setColor("RED");
						message.channel.send({ embed });
						throw err;
					});
			} else {
				message.channel.send({
					embed: {
						color: 0xff0000,
						title: "Not supported",
						description:
							"This value is not vaild. Please check `&uconfig list` for the vaild values for this setting."
					}
				});
			}
		} else {
			message.channel.send({
				embed: {
					color: 0xff0000,
					title: "Invaild key",
					description: "This key does not exist. Check `&uconfig list` for the keys accepted.."
				}
			});
		}
	}
};
