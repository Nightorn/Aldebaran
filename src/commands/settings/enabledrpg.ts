import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import Command from "../../groups/SettingsCommand.js";
import Client from "../../structures/Client.js";
import { ServerSettingKey, UserSettingKey } from "../../utils/Constants.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";

type Context = DiscordMessageContext<true> | DiscordSlashMessageContext<true>;
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
	constructor(client: Client) {
		super(client, {
			aliases: ["edrpg"],
			description:
				"Utility command to enable configuration values for DiscordRPG usage",
			requiresGuild: true,
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	configuringEmbed(ctx: Context, type: string) {
		const parameters = type === "user" ? userParameters : guildParameters;
		const list = (parameters as SettingParameters<string>)
			.reduce((p, c) => `${p}${`${c.description} - \`${c.name}\``}\n`, "");
		return new MessageEmbed()
			.setTitle(`Configuring ${type}'s settings`)
			.setDescription(`**This will enable the following ${
				type} settings:**\n${list
			}**Do you want to proceed?** Click the **Proceed** button to continue. You can always configure the settings using \`${ctx.prefix}${type[0]}config\`.`)
			.setColor("BLUE");
	}

	setSettings(ctx: Context, type: "user" | "guild", followUp = false) {
		return new Promise(resolve => {
			const embed = this.configuringEmbed(ctx, type);
			const button = new MessageButton()
				.setStyle("PRIMARY")
				.setLabel("Proceed")
				.setCustomId("ok");
			const actionRow = new MessageActionRow().setComponents([button]);
			const opt = { embeds: [embed], components: [actionRow] };

			let message: Promise<Message<boolean>>;
			if (ctx instanceof DiscordSlashMessageContext && followUp) {
				message = ctx.followUp(opt, true, true);
			} else if (ctx instanceof DiscordSlashMessageContext) {
				message = ctx.reply(opt, true, true);
			} else {
				message = ctx.reply(opt);
			}

			message.then(msg => {
				msg.awaitMessageComponent({ componentType: "BUTTON" }).then(interaction => {
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

	done(ctx: Context, followUp = false) {
		const embed = new MessageEmbed()
			.setTitle("Done!")
			.setDescription(
				`${ctx.client.name}'s DRPG features are now enabled. Feel free to use DRPG normally. ${ctx.client.name} will respond appropriately when your adventure and sides are ready, and when you have low health.\nYou can always turn off features in \`${ctx.prefix}uconfig\` and \`${ctx.prefix}gconfig\`.\n*If this guild has changed its DRPG prefix, it must also be set using \`${ctx.prefix}gconfig discordrpgPrefix <prefix>\`.*`
			)
			.setColor("GREEN");

		if (ctx instanceof DiscordSlashMessageContext) {
			followUp ? ctx.followUp(embed, true) : ctx.reply(embed, true);
		} else {
			ctx.reply(embed);
		}
	}

	noPermissions(ctx: Context) {
		const embed = new MessageEmbed()
			.setTitle("Oops!")
			.setDescription(
				`This guild's administrators have not set their guild settings to enable DRPG. Please ask them to run \`${ctx.prefix}enabledrpg\`.`
			)
			.setColor("RED");
		ctx.reply(embed);
	}

	async run(ctx: Context) {
		const isAdmin = ctx.member
			.permissionsIn(ctx.channel as TextChannel)
			.has("MANAGE_GUILD");

		const guildEnabled = guildParameters
			.every(parameter => ctx.server.base.getSetting(parameter.name) === "on");
		const userEnabled = userParameters
			.every(parameter => ctx.author.base.getSetting(parameter.name) === "on");

		if (isAdmin && !guildEnabled && !userEnabled) {
			await this.setSettings(ctx, "guild");
			await this.setSettings(ctx, "user", true);
			this.done(ctx, true);
		} else if (isAdmin && !guildEnabled) {
			await this.setSettings(ctx, "guild");
			this.done(ctx, true);
		} else if (isAdmin && !userEnabled) {
			await this.setSettings(ctx, "user");
			this.done(ctx, true);
		} else if (!isAdmin && !guildEnabled) {
			this.noPermissions(ctx);
		} else if (!isAdmin && !userEnabled) {
			await this.setSettings(ctx, "user");
			this.done(ctx, true);
		} else {
			this.done(ctx);
		}
	}
}
