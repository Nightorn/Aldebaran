import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { GuildSetting, Settings, SettingsModel, TargetedSettings, UserSetting } from "../../utils/Constants.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class UconfigCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Manages your Aldebaran personal settings",
			usage: "Parameter Value",
			example: "adventureTimer on"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const author = await ctx.author();
		const setting = args[0] as UserSetting;
		const parametersAvailable = SettingsModel.user as Settings["user"];
		if (args.length === 0) {
			const embed = new MessageEmbed()
				.setAuthor("User Settings", ctx.client.user.avatarURL()!)
				.setDescription(
					`Welcome to your user settings! This command allows you to customize Aldebaran to your needs. The available properties are listed in \`${ctx.prefix}uconfig list\`, and your current settings are shown in \`${ctx.prefix}uconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}uconfig property value\`, and one example is \`${ctx.prefix}uconfig adventureTimer on\`.`
				)
				.setColor("BLUE")
				.setFooter(
					`Make sure to also use \`${ctx.prefix}gconfig\` for server settings.`
				);
			ctx.reply(embed);
		} else if (args.includes("list")) {
			const list: { [key: string]: { [key: string]: TargetedSettings } } = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (list[data.category] === undefined) list[data.category] = {};
				if (data.showOnlyIfBotIsInGuild && ctx.message.guild) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await ctx.message.guild.members.fetch(data.showOnlyIfBotIsInGuild);
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
				.setDescription(
					"**__IMPORTANT: If setting is disabled in &gconfig by server owner, it will be ignored.__** If a server setting is undefined, a :warning: icon will appear in front of the concerned properties."
				)
				.setColor("BLUE");
			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters)) {
					if (ctx.message.guild) {
						const guild = (await ctx.guild())!; // eslint-disable-line no-await-in-loop
						if (guild.settings[key as GuildSetting] === undefined
							&& ctx.client.models.settings.guild[key as GuildSetting]
						) {
							entries += ":warning: ";
						}
					}
					entries += `**${key}** - ${data.help}\n`;
				}
				embed.addField(category, entries);
			}
			ctx.reply(embed);
		} else if (args.includes("view")) {
			let list = "";
			for (const [key, value] of Object.entries(author.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = new MessageEmbed()
				.setAuthor("User Settings  |  Overview", ctx.client.user.avatarURL()!)
				.setDescription(list === "" ? "None" : list)
				.setColor("BLUE");
			ctx.reply(embed);
		} else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
			if (parametersAvailable[setting]!.support(args[1])) {
				author.changeSetting(setting, args[1])
					.then(() => {
						if (parametersAvailable[setting]!.postUpdate) {
							/* eslint-disable no-param-reassign */
							parametersAvailable[setting]!.postUpdate!(
								args[1],
								ctx.message.author
							);
						}
						if (parametersAvailable[setting]!.postUpdate) {
							parametersAvailable[setting]!
								.postUpdate!(args[1], ctx.message.author);
						}
						const embed = new MessageEmbed()
							.setAuthor(
								ctx.message.author.username,
								ctx.message.author.displayAvatarURL()
							)
							.setTitle("Settings successfully changed")
							.setDescription(
								`The property **\`${
									setting
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
				const embed = new MessageEmbed()
					.setTitle("Not supported")
					.setDescription("This value is not vaild. Please check `&uconfig list` for the vaild values for this setting.")
					.setColor("RED");
				ctx.reply(embed);
			}
		} else {
			const embed = new MessageEmbed()
				.setTitle("Invalid key")
				.setDescription("This key does not exist. Check `&uconfig list` for the keys accepted.")
				.setColor("RED");
			ctx.reply(embed);
		}
	}
};
