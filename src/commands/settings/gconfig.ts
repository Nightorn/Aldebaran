import { MessageEmbed } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { GuildSetting, Settings, SettingsModel, TargetedSettings } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class GconfigCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
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
		const parametersAvailable = SettingsModel.guild as Settings["guild"];
		if (args.setting === "help") {
			const embed = new MessageEmbed()
				.setAuthor({
					name: "User Settings",
					iconURL: ctx.client.user.avatarURL()!
				})
				.setDescription(
					`Welcome to your server settings! This command allows you to customize ${ctx.client.name} to your needs. The available properties are listed in \`${ctx.prefix}gconfig list\`, and your current settings are shown in \`${ctx.prefix}gconfig view\`. To change a property, you need to use this command like that: \`${ctx.prefix}gconfig property value\`, and one example is \`${ctx.prefix}gconfig adventureTimer on\`.`
				);
			ctx.reply(embed);
		} else if (args.setting === "list") {
			const list: { [key: string]: { [key: string]: TargetedSettings } } = {};
			for (const [key, data] of Object.entries(parametersAvailable)) {
				if (!list[data.category]) list[data.category] = {};
				if (data.showOnlyIfBotIsInGuild) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await ctx.guild!.guild.members.fetch(data.showOnlyIfBotIsInGuild);
						list[data.category][key] = data;
					} catch {} // eslint-disable-line no-empty
				} else {
					list[data.category][key] = data;
				}
			}

			const embed = this.createEmbed(ctx)
				.setTitle("Config Command Help Page");
			for (const [category, parameters] of Object.entries(list)) {
				let entries = "";
				for (const [key, data] of Object.entries(parameters)) {
					entries += `**${key}** - ${data.help}\n`;
				}
				if (entries) {
					embed.addField(category, entries);
				}
			}
			ctx.reply(embed);
		} else if (args.setting === "view") {
			let list = "";
			for (const [key, value] of Object.entries(ctx.guild!.settings)) {
				list += `**${key}** - \`${value}\`\n`;
			}
			const embed = this.createEmbed(ctx)
				.setAuthor({
					name: "Guild Settings  |  Overview",
					iconURL: ctx.client.user.avatarURL()!
				})
				.setDescription(list === "" ? "None" : list);
			ctx.reply(embed);
		} else if (Object.keys(parametersAvailable).includes(args.setting)
				&& args.value) {
			const setting = args.setting.toLowerCase() as GuildSetting;
			if (parametersAvailable[setting]!.support(args.value)) {
				if (parametersAvailable[setting]!.postUpdate) {
					parametersAvailable[setting]!.postUpdate!(
						args.value,
						ctx.author.user,
						ctx.guild!.guild
					);
				}
				if (parametersAvailable[setting]!.postUpdate) {
					parametersAvailable[
						setting
					]!.postUpdate!(args.value, ctx.author.user, ctx.guild!.guild);
				}
				ctx.guild!.changeSetting(setting, args.value).then(() => {
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
