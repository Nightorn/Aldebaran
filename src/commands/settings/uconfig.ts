import { MessageEmbed } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import Client from "../../structures/Client.js";
import { SettingsModel, Setting, UserSettingKey, ServerSettingKey } from "../../utils/Constants.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";

export default class UconfigCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Manages your personal settings",
			example: "adventureTimer on",
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

	async run(ctx: DiscordMessageContext) {
		const args = ctx.args as { setting: string, value?: string };
		console.log(args);
		const parameters = SettingsModel.user;
		if (args.setting === "help") {
			const embed = this.createEmbed(ctx)
				.setAuthor({
					name: "User Settings",
					iconURL: ctx.client.discord.user.displayAvatarURL()
				})
				.setDescription(
					`Welcome to your user settings! This command allows you to customize ${ctx.client.name} to your needs. The available properties are listed in \`${ctx.prefix}uconfig list\`, and your current settings are shown in \`${ctx.prefix}uconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}uconfig property value\`, and one example is \`${ctx.prefix}uconfig adventureTimer on\`.`
				)
				.setFooter({
					text: `Make sure to also use \`${ctx.prefix}gconfig\` for server settings.`
				});
			ctx.reply(embed);
		} else if (args.setting === "list") {
			const list: { [key: string]: { [key in UserSettingKey]?: Setting } } = {};
			for (const [key, data] of Object.entries(parameters)) {
				if (list[data.category] === undefined) list[data.category] = {};
				if ("showOnlyIfBotIsInGuild" in data && ctx.server) {
					try {
						await ctx.server.guild.members.fetch(data.showOnlyIfBotIsInGuild);
						list[data.category][key as UserSettingKey] = data;
					} catch {}
				} else {
					list[data.category][key as UserSettingKey] = data;
				}
			}
			const embed = this.createEmbed(ctx)
				.setTitle("Config Command Help Page")
				.setDescription(
					`**__IMPORTANT: If the setting is disabled in ${ctx.prefix}gconfig by server owner, it will be ignored.__** If a server setting is undefined, a :warning: icon will appear in front of the concerned properties.`
				);

			for (const [category, params] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(params)) {
					if (ctx.server && !ctx.server.base.getSetting(key as ServerSettingKey)) {
						entries += ":warning: ";
					}
					entries += `**${key}** - ${data.help}\n`;
				}
				if (entries) {
					embed.addField(category, entries);
				}
			}
			ctx.reply(embed);
		} else if (args.setting === "view") {
			const list = ctx.author.base.settings
				.reduce((acc, x) => `${acc}**${x.key}** - \`${x.value}\`\n`, "");
			const embed = this.createEmbed(ctx)
				.setAuthor({
					name: "User Settings  |  Overview",
					iconURL: ctx.client.discord.user.displayAvatarURL()
				})
				.setDescription(list === "" ? "None" : list);
			ctx.reply(embed);
		} else if (Object.keys(parameters).includes(args.setting) && args.value) {
			const setting = args.setting.toLowerCase() as UserSettingKey;
			if (parameters[setting].support(args.value)) {
				ctx.author.base.setSetting(setting, args.value).then(() => {
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
