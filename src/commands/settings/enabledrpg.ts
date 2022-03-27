import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { GuildSetting, Platform, UserSetting } from "../../utils/Constants.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";

const guildParameters = [
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

const userParameters = [
	...guildParameters,
	{
		name: "timerping",
		description: "DiscordRPG Timer Pings"
	}
];

export default class EnableDRPGCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			aliases: ["edrpg"],
			description:
				"Utility command to enable configuration values for DiscordRPG usage",
			requiresGuild: true,
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	configuringEmbed(ctx: MessageContext, type: string) {
		const parameters = type === "user" ? userParameters : guildParameters;
		return new MessageEmbed()
			.setTitle(`Configuring ${type}'s settings`)
			.setDescription(`**This will enable the following ${
				type} settings:**\n${
				parameters.reduce((p, c) => `${p}${`${c.description} - \`${c.name}\``}\n`, "")
			}**Do you want to proceed?** Click the **Proceed** button to continue. You can always configure the settings using \`${ctx.prefix}${type[0]}config\`.`)
			.setColor("BLUE");
	}

	setSettings(
		ctx: DiscordMessageContext | DiscordSlashMessageContext,
		type: "user" | "guild",
	) {
		return new Promise(async resolve => {
			const embed = this.configuringEmbed(ctx, type);
			const button = new MessageButton()
				.setStyle("PRIMARY")
				.setLabel("Proceed")
				.setCustomId("ok");
			const actionRow = new MessageActionRow().setComponents([button]);
			const opt = { embeds: [embed], components: [actionRow] };
			const msg = ctx instanceof DiscordSlashMessageContext
				? await ctx.reply(opt, true, true)
				: await ctx.reply(opt);

			msg.awaitMessageComponent({ componentType: "BUTTON" }).then(interaction => {
				if (type === "user") {
					userParameters.forEach(parameter => {
						ctx.author.changeSetting(parameter.name as UserSetting, "on");
					});
				} else {
					guildParameters.forEach(parameter => {
						ctx.guild!.changeSetting(parameter.name as GuildSetting, "on");
					});
				}
				interaction.deferUpdate();
				resolve(true);
			}).catch(() => {
				msg.edit("The operation has been cancelled.");
			});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	done(
		ctx: DiscordMessageContext | DiscordSlashMessageContext,
		followUp: boolean = false
	) {
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

	// eslint-disable-next-line class-methods-use-this
	noPermissions(ctx: MessageContext) {
		const embed = new MessageEmbed()
			.setTitle("Oops!")
			.setDescription(
				`This guild's administrators have not set their guild settings to enable DRPG. Please ask them to run \`${ctx.prefix}enabledrpg\`.`
			)
			.setColor("RED");
		ctx.reply(embed);
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: DiscordMessageContext | DiscordSlashMessageContext) {
		const isAdmin = ctx.member!
			.permissionsIn(ctx.channel as TextChannel)
			.has("MANAGE_GUILD");

		const guildEnabled = guildParameters
			.every(parameter => ctx.guild!.settings[parameter.name as GuildSetting] === "on");
		const userEnabled = userParameters
			.every(parameter => ctx.author.settings[parameter.name as UserSetting] === "on");

		if (isAdmin && !guildEnabled && !userEnabled) {
			await this.setSettings(ctx, "guild");
			await this.setSettings(ctx, "user");
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
};
