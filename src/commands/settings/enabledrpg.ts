import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, TextChannel, ButtonStyle, ComponentType } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import { ServerSettingKey, UserSettingKey } from "../../utils/Constants.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";

type SettingParameters<T> = { name: T, description: string }[];

const guildParameters: SettingParameters<ServerSettingKey> = [
	{
		name: "healthmonitor",
		description: "DiscordRPG Health Monitor"
	},
	{
		name: "adventuretimer",
		description: "DiscordRPG Adventure Timer"
	},
	{
		name: "sidestimer",
		description: "DiscordRPG Sides Timer"
	}
];

const userParameters: SettingParameters<UserSettingKey> = [
	...guildParameters as SettingParameters<UserSettingKey>,
	{
		name: "timerping",
		description: "DiscordRPG Timer Pings"
	}
];

export default class EnableDRPGCommand extends Command {
	constructor() {
		super({
			aliases: ["edrpg"],
			description:
				"Utility command to enable configuration values for DiscordRPG usage",
			requiresGuild: true,
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	configuringEmbed(ctx: DiscordContext<true>, type: string) {
		const parameters = type === "user" ? userParameters : guildParameters;
		const list = (parameters as SettingParameters<string>)
			.reduce((p, c) => `${p}${`${c.description} - \`${c.name}\``}\n`, "");
		return new EmbedBuilder()
			.setTitle(`Configuring ${type}'s settings`)
			.setDescription(`**This will enable the following ${
				type} settings:**\n${list
			}**Do you want to proceed?** Click the **Proceed** button to continue. You can always configure the settings using \`${ctx.prefix}${type[0]}config\`.`)
			.setColor("Blue");
	}

	setSettings(ctx: DiscordContext<true>, type: "user" | "guild") {
		return new Promise(resolve => {
			const embed = this.configuringEmbed(ctx, type);
			const button = new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setLabel("Proceed")
				.setCustomId("ok");
			const actionRow = new ActionRowBuilder<ButtonBuilder>()
				.setComponents(button);
			const opt = { embeds: [embed.toJSON()], components: [actionRow] };

			const message = ctx instanceof DiscordSlashMessageContext
				? ctx.reply(opt, true, true)
				: ctx.reply(opt);

			message.then(msg => { msg
				.awaitMessageComponent({ componentType: ComponentType.Button })
				.then(interaction => {
					if (type === "user") {
						userParameters.forEach(parameter => {
							ctx.author.base.setSetting(parameter.name, "on");
						});
					} else {
						guildParameters.forEach(parameter => {
							ctx.server.base.setSetting(parameter.name, "on");
						});
					}
					interaction.deferUpdate();
					resolve(true);
				}).catch(() => {
					msg.edit("The operation has been cancelled.");
				});
			});
		});
	}

	done(ctx: DiscordContext<true>) {
		const embed = new EmbedBuilder()
			.setTitle("Done!")
			.setDescription(
				`${ctx.client.name}'s DRPG features are now enabled. Feel free to use DRPG normally. ${ctx.client.name} will respond appropriately when your adventure and sides are ready, and when you have low health.\nYou can always turn off features in \`${ctx.prefix}uconfig\` and \`${ctx.prefix}gconfig\`.\n`
			)
			.setColor("Green");

		ctx instanceof DiscordSlashMessageContext
			? ctx.reply(embed, true)
			: ctx.reply(embed);
	}

	noPermissions(ctx: DiscordContext<true>) {
		const embed = new EmbedBuilder()
			.setTitle("Oops!")
			.setDescription(
				`This guild's administrators have not set their guild settings to enable DRPG. Please ask them to run \`${ctx.prefix}enabledrpg\`.`
			)
			.setColor("Red");
		ctx.reply(embed);
	}

	async run(ctx: DiscordContext<true>) {
		const isAdmin = ctx.member
			.permissionsIn(ctx.channel as TextChannel)
			.has("ManageGuild");

		const guildEnabled = guildParameters
			.every(parameter => ctx.server.base.getSetting(parameter.name) === "on");
		const userEnabled = userParameters
			.every(parameter => ctx.author.base.getSetting(parameter.name) === "on");

		if (isAdmin && !guildEnabled && !userEnabled) {
			await this.setSettings(ctx, "guild");
			await this.setSettings(ctx, "user");
			this.done(ctx);
		} else if (isAdmin && !guildEnabled) {
			await this.setSettings(ctx, "guild");
			this.done(ctx);
		} else if (isAdmin && !userEnabled) {
			await this.setSettings(ctx, "user");
			this.done(ctx);
		} else if (!isAdmin && !guildEnabled) {
			this.noPermissions(ctx);
		} else if (!isAdmin && !userEnabled) {
			await this.setSettings(ctx, "user");
			this.done(ctx);
		} else {
			this.done(ctx);
		}
	}
}
