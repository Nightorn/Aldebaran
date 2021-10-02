import { MessageEmbed, MessageReaction, User } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import { GuildSetting, UserSetting } from "../../utils/Constants.js";

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
			requiresGuild: true
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
			}**Do you want to proceed?** Click :white_check_mark: to continue. You can always configure the settings in \`${ctx.prefix}${type[0]}config\`.`)
			.setColor("BLUE");
	}

	setUserSettings(ctx: MessageContext) {
		return new Promise(async resolve => {
			const author = await ctx.author();
			const embed = this.configuringEmbed(ctx, "user");
			const checkMark = "✅";
			const filter = (r: MessageReaction, u: User) => r.emoji.name === checkMark
				&& u.id === ctx.message.author.id;
			const msg = await ctx.reply(embed);
			await msg.react(checkMark);
			msg.awaitReactions({ filter, time: 30000, max: 1, errors: ["time"] })
				.then(() => {
					userParameters.forEach(parameter => {
						author.changeSetting(parameter.name as UserSetting, "on");
					});
					resolve(true);
				}).catch(() => {
					msg.reactions.removeAll();
					msg.edit("The operation has been cancelled.");
				});
		});
	}

	setGuildSettings(ctx: MessageContext) {
		return new Promise(async resolve => {
			const guild = (await ctx.guild())!;
			const embed = this.configuringEmbed(ctx, "guild");
			const checkMark = "✅";
			const filter = (r: MessageReaction, u: User) => r.emoji.name === checkMark
				&& u.id === ctx.message.author.id;
			const msg = await ctx.reply(embed);
			await msg.react(checkMark);
			msg.awaitReactions({ filter, time: 30000, max: 1, errors: ["time"] }).then(() => {
				guildParameters.forEach(parameter => {
					guild.changeSetting(parameter.name as GuildSetting, "on");
				});
				resolve(true);
			}).catch(() => {
				msg.reactions.removeAll();
				msg.edit("The operation has been cancelled.");
			});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	done(ctx: MessageContext) {
		const embed = new MessageEmbed()
			.setTitle("Done!")
			.setDescription(
				`Aldebaran's DRPG features are now enabled. Feel free to use DRPG normally. Aldebaran will respond appropriately when your adventure and sides are ready, and when you have low health.\nYou can always turn off features in \`${ctx.prefix}uconfig\` and \`${ctx.prefix}gconfig\`.\n*If this guild has changed its DRPG prefix, it must also be set using \`${ctx.prefix}gconfig discordrpgPrefix <prefix>\`.*`
			)
			.setColor("GREEN");
		ctx.reply(embed);
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
	async run(ctx: MessageContext) {
		const author = await ctx.author();
		const guild = (await ctx.guild())!;

		const isAdmin = ctx.message.member!
			.permissionsIn(ctx.channel)
			.has("ADMINISTRATOR");

		const guildEnabled = guildParameters
			.every(parameter => guild.settings[parameter.name as GuildSetting] === "on");
		const userEnabled = userParameters
			.every(parameter => author.settings[parameter.name as UserSetting] === "on");

		if (isAdmin && !guildEnabled && !userEnabled) {
			await this.setGuildSettings(ctx);
			await this.setUserSettings(ctx);
			this.done(ctx);
		} else if (isAdmin && !guildEnabled) {
			await this.setGuildSettings(ctx);
			this.done(ctx);
		} else if (isAdmin && !userEnabled) {
			await this.setUserSettings(ctx);
			this.done(ctx);
		} else if (isAdmin) {
			this.done(ctx);
		} else if (!isAdmin && !guildEnabled) {
			this.noPermissions(ctx);
		} else if (!isAdmin && !userEnabled) {
			await this.setUserSettings(ctx);
			this.done(ctx);
		} else {
			this.done(ctx);
		}
	}
};
