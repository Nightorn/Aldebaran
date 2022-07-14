import { MessageEmbed } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import { ServerSettingKey, Setting, SettingsModel } from "../../utils/Constants.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";

export default class GconfigCommand extends Command {
	constructor() {
		super({
			description: "Manages the settings of your server",
			example: "adventureTimer on",
			perms: { discord: ["MANAGE_GUILD"] },
			requiresGuild: true,
			args: {
				setting: {
					as: "string",
					desc: "The setting you want to edit (or \"help\", \"list\" and \"view\" for more information)"
				},
				value: {
					as: "expression",
					desc: "The value to which you want to edit the setting you just selected, if any",
					regex: /.+/,
					optional: true
				}
			},
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordContext<true>) {
		const args = ctx.args as { setting: string, value?: string };
		const parameters = SettingsModel.guild;
		if (args.setting === "help") {
			const embed = new MessageEmbed()
				.setTitle("User Settings")
				.setDescription(
					`Welcome to your server settings! This command allows you to customize ${ctx.client.name} to your needs. The available properties are listed in \`${ctx.prefix}gconfig list\`, and your current settings are shown in \`${ctx.prefix}gconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}gconfig property value\`, and one example is \`${ctx.prefix}gconfig adventureTimer on\`.`
				);
			ctx.reply(embed);
		} else if (args.setting === "list") {
			const list: { [key: string]: { [key in ServerSettingKey]?: Setting } } = {};
			for (const [key, data] of Object.entries(parameters)) {
				if (!list[data.category]) list[data.category] = {};
				if ("showOnlyIfBotIsInGuild" in data) {
					try {
						await ctx.server.guild.members.fetch(data.showOnlyIfBotIsInGuild);
						list[data.category][key as ServerSettingKey] = data;
					} catch {}
				} else {
					list[data.category][key as ServerSettingKey] = data;
				}
			}

			const embed = this.createEmbed(ctx)
				.setTitle("Config Command Help Page");
			for (const [category, params] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(params)) {
					entries += `**${key}** - ${data.help}\n`;
				}
				if (entries) {
					embed.addField(category, entries);
				}
			}
			ctx.reply(embed);
		} else if (args.setting === "view") {
			let list = "";
			ctx.server.base.settings.forEach(s => {
				list += `**${s.key}** - \`${s.value}\`\n`;
			});
			const embed = this.createEmbed(ctx)
				.setTitle("Guild Settings  |  Overview")
				.setDescription(list === "" ? "None" : list);
			ctx.reply(embed);
		} else if (Object.keys(parameters).includes(args.setting) && args.value) {
			const setting = args.setting.toLowerCase() as ServerSettingKey;
			if (parameters[setting].support(args.value)) {
				ctx.server.base.setSetting(setting, args.value).then(() => {
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
				ctx.reply(
					`**Error** This value is not supported, check \`${ctx.prefix}gconfig list\` for more information.`
				);
			}
		} else {
			ctx.reply(
				`**Error** This key does not exist, check \`${ctx.prefix}gconfig list\` for more information.`
			);
		}
		return true;
	}
}
