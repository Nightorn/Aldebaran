import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { GuildSetting, Settings, SettingsModel, TargetedSettings } from "../../utils/Constants.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class GconfigCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Manages the Aldebaran settings of your server",
			usage: "Parameter Value",
			example: "adventureTimer on",
			perms: { discord: ["ADMINISTRATOR"] },
			requiresGuild: true
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const setting = args[0] as GuildSetting;
		const guild = (await ctx.guild())!;
		const parametersAvailable = SettingsModel.guild as Settings["guild"];
		if (args.length === 0) {
			const embed = new MessageEmbed()
				.setAuthor("User Settings", ctx.client.user.avatarURL()!)
				.setDescription(
					`Welcome to your server settings! This command allows you to customize Aldebaran to your needs. The available properties are listed in \`${ctx.prefix}gconfig list\`, and your current settings are shown in \`${ctx.prefix}gconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}gconfig property value\`, and one example is \`${ctx.prefix}gconfig adventureTimer on\`.`
				)
				.setColor("BLUE");
			ctx.reply(embed);
		} else if (args.includes("list")) {
			const list: { [key: string]: { [key: string]: TargetedSettings } } = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (!list[data.category]) list[data.category] = {};
				if (data.showOnlyIfBotIsInGuild) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await ctx.message.guild!.members.fetch(data.showOnlyIfBotIsInGuild);
						list[data.category][key] = data;
					} catch {} // eslint-disable-line no-empty
				} else {
					list[data.category][key] = data;
				}
			}
			const embed = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Config Command Help Page")
				.setColor("BLUE");
			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters)) {
					entries += `**${key}** - ${data.help}\n`;
				}
				embed.addField(category, entries);
			}
			ctx.reply(embed);
		} else if (args.includes("view")) {
			let list = "";
			for (const [key, value] of Object.entries(guild.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = new MessageEmbed()
				.setAuthor("Guild Settings  |  Overview", ctx.client.user.avatarURL()!)
				.setDescription(list === "" ? "None" : list)
				.setColor("BLUE");
			ctx.reply(embed);
		} else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
			if (parametersAvailable[setting]!.support(args[1])) {
				if (parametersAvailable[setting]!.postUpdate) {
					/* eslint-disable no-param-reassign */
					parametersAvailable[setting]!.postUpdate!(
						args[1],
						ctx.message.author,
						ctx.message.guild!
					);
				}
				if (parametersAvailable[setting]!.postUpdate) {
					parametersAvailable[
						setting
					]!.postUpdate!(args[1], ctx.message.author, ctx.message.guild!);
					/* eslint-enable no-param-reassign */
				}
				guild.changeSetting(setting, args[1]).then(() => {
					const embed = new MessageEmbed()
						.setAuthor(
							ctx.message.author.username,
							ctx.message.author.displayAvatarURL()
						)
						.setTitle("Settings successfully changed")
						.setDescription(
							`The property **\`${
								args[0]
							}\`** has successfully been changed to the value **\`${
								args[1]
							}\`**.`
						)
						.setColor("GREEN");
					ctx.reply(embed);
				}).catch(err => {
					const embed = new MessageEmbed()
						.setAuthor(
							ctx.message.author.username,
							ctx.message.author.displayAvatarURL()
						)
						.setTitle("An Error Occured")
						.setDescription(
							"An error occured and we could not change your settings. Please retry later."
						)
						.setColor("RED");
					ctx.reply(embed);
					throw err;
				});
			} else {
				ctx.reply(
					"**Error** This value is not supported, check `&gconfig list` for more informations."
				);
			}
		} else {
			ctx.reply(
				"**Error** This key does not exist, check `&gconfig list` for more informations."
			);
		}
		return true;
	}
};
