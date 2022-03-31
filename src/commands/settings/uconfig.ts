import { MessageEmbed } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { GuildSetting, Settings, SettingsModel, TargetedSettings, UserSetting } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class UconfigCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Manages your personal settings",
			example: "adventureTimer on",
			args: {
				setting: {
					as: "string",
					desc: "The setting you want to edit (or \"help\", \"list\" and \"view\" for more information)"
				},
				value: {
					as: "string",
					desc: "The value to which you want to edit the setting you just selected, if any",
					optional: true
				}
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as { setting: string, value?: string };
		const parametersAvailable = SettingsModel.user as Settings["user"];
		if (args.setting === "help") {
			const embed = this.createEmbed(ctx)
				.setAuthor({
					name: "User Settings",
					iconURL: ctx.client.user.avatarURL()!
				})
				.setDescription(
					`Welcome to your user settings! This command allows you to customize ${ctx.client.name} to your needs. The available properties are listed in \`${ctx.prefix}uconfig list\`, and your current settings are shown in \`${ctx.prefix}uconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}uconfig property value\`, and one example is \`${ctx.prefix}uconfig adventureTimer on\`.`
				)
				.setFooter({
					text: `Make sure to also use \`${ctx.prefix}gconfig\` for server settings.`
				});
			ctx.reply(embed);
		} else if (args.setting === "list") {
			const list: { [key: string]: { [key: string]: TargetedSettings } } = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (list[data.category] === undefined) list[data.category] = {};
				if (data.showOnlyIfBotIsInGuild && ctx.guild) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await ctx.guild.guild.members.fetch(data.showOnlyIfBotIsInGuild);
						list[data.category][key] = data;
					} catch {} // eslint-disable-line no-empty
				} else {
					list[data.category][key] = data;
				}
			}
			const embed = this.createEmbed(ctx)
				.setTitle("Config Command Help Page")
				.setDescription(
					`**__IMPORTANT: If the setting is disabled in ${ctx.prefix}gconfig by server owner, it will be ignored.__** If a server setting is undefined, a :warning: icon will appear in front of the concerned properties.`
				);

			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters)) {
					if (ctx.guild) {
						if (!ctx.guild.settings[key as GuildSetting]
							&& ctx.client.models.settings.guild[key as GuildSetting]
						) {
							entries += ":warning: ";
						}
					}
					entries += `**${key}** - ${data.help}\n`;
				}
				if (entries) {
					embed.addField(category, entries);
				}
			}
			ctx.reply(embed);
		} else if (args.setting === "view") {
			let list = "";
			for (const [key, value] of Object.entries(ctx.author.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = this.createEmbed(ctx)
				.setAuthor({
					name: "User Settings  |  Overview",
					iconURL: ctx.client.user.avatarURL()!
				})
				.setDescription(list === "" ? "None" : list);
			ctx.reply(embed);
		} else if (Object.keys(parametersAvailable).includes(args.setting)
				&& args.value) {
			const setting = args.setting.toLowerCase() as UserSetting;
			if (parametersAvailable[setting]!.support(args.value)) {
				ctx.author.changeSetting(setting, args.value).then(() => {
					if (parametersAvailable[setting]!.postUpdate) {
						parametersAvailable[setting]!.postUpdate!(
							args.value!,
							ctx.author.user
						);
					}
					if (parametersAvailable[setting]!.postUpdate) {
						parametersAvailable[setting]!
							.postUpdate!(args.value!, ctx.author.user);
					}
					const embed = this.createEmbed(ctx)
						.setTitle("Settings successfully changed")
						.setDescription(
							`The property **\`${
								setting
							}\`** has successfully been changed to the value **\`${
								args.value
							}\`**.`
						)
						.setColor("GREEN");
					ctx.reply(embed);
				}).catch(err => {
					const embed = this.createEmbed(ctx)
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
					.setDescription(`This value is not vaild. Please check \`${ctx.prefix}uconfig list\` for the vaild values for this setting.`)
					.setColor("RED");
				ctx.reply(embed);
			}
		} else {
			const embed = new MessageEmbed()
				.setTitle("Invalid key")
				.setDescription(`This key does not exist. Check \`${ctx.prefix}uconfig list\` for the keys accepted.`)
				.setColor("RED");
			ctx.reply(embed);
		}
	}
}
