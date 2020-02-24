const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/SettingsCommand");

const descriptions = {
	healthMonitor: "DiscordRPG Health Monitor",
	adventureTimer: "DiscordRPG Adventure Timer",
	sidesTimer: "DiscordRPG Sides Timer"
};
const guildParameters = ["healthMonitor", "adventureTimer", "sidesTimer"];
const userParameters = ["healthMonitor", "adventureTimer", "sidesTimer"];

module.exports = class EnableDRPGCommand extends Command {
	constructor(client) {
		super(client, {
			description:
				"Utility command to enable configuration values for DiscordRPG usage",
			aliases: ["edrpg"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	configuringEmbed(message, type) {
		const { prefix } = message.guild;
		const parameters = type ? userParameters : guildParameters;
		return new MessageEmbed()
			.setTitle(`Configuring ${type}'s settings`)
			.setDescription(`**This will enable the following ${
				type} settings:**\n${
				parameters.reduce((p, c) => `${p}${`${descriptions[c]} - \`${c}\``}\n`, "")
			}**Do you want to proceed?** Click :white_check_mark: to continue. You can always configure the settings in \`${prefix}${type[0]}config\`.`)
			.setColor("BLUE");
	}

	setUserSettings(message) {
		return new Promise(async resolve => {
			const embed = this.configuringEmbed(message, "user");
			const checkMark = "✅";
			const filter = (r, u) => r.emoji.name === checkMark
				&& u.id === message.author.id;
			const msg = await message.channel.send({ embed });
			await msg.react(checkMark);
			msg.awaitReactions(filter, { time: 30000, max: 1, errors: ["time"] }).then(() => {
				userParameters.forEach(parameter => {
					message.author.changeSetting(parameter, "on");
				});
				resolve();
			}).catch(() => {
				msg.reactions.removeAll();
				msg.edit("The operation has been cancelled.");
			});
		});
	}

	setGuildSettings(message) {
		return new Promise(async resolve => {
			const embed = this.configuringEmbed(message, "guild");
			const checkMark = "✅";
			const filter = (r, u) => r.emoji.name === checkMark
				&& u.id === message.author.id;
			const msg = await message.channel.send({ embed });
			await msg.react(checkMark);
			msg.awaitReactions(filter, { time: 30000, max: 1, errors: ["time"] }).then(() => {
				guildParameters.forEach(parameter => {
					message.guild.changeSetting(parameter, "on");
				});
				resolve();
			}).catch(() => {
				msg.reactions.removeAll();
				msg.edit("The operation has been cancelled.");
			});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	done(message) {
		const { prefix } = message.guild;
		const embed = new MessageEmbed()
			.setTitle("Done!")
			.setDescription(
				`Aldebaran's DRPG features are now enabled. Feel free to use DRPG normally. Aldebaran will respond appropriately when your adventure and sides are ready, and when you have low health.\nYou can always turn off features in \`${prefix}uconfig\` and \`${prefix}gconfig\`.\n*If this guild has changed it's DRPG prefix, it must also be set using \`${prefix}gconfig discordrpgPrefix <prefix>\`.*`
			)
			.setColor("GREEN");
		message.channel.send({ embed });
	}

	// eslint-disable-next-line class-methods-use-this
	noPermissions(message) {
		const { prefix } = message.guild;
		const embed = new MessageEmbed()
			.setTitle("Oops!")
			.setDescription(
				`This guild's administrators have not set their guild settings to enable DRPG. Please ask them to run \`${prefix}enabledrpg\`.`
			)
			.setColor("RED");
		message.channel.send({ embed });
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot, message) {
		const isAdmin = message.member
			.permissionsIn(message.channel)
			.has("ADMINISTRATOR");

		const guildEnabled = guildParameters
			.every(parameter => message.guild.settings[parameter] === "on");
		const userEnabled = userParameters
			.every(parameter => message.author.settings[parameter] === "on");

		if (isAdmin && !guildEnabled && !userEnabled) {
			await this.setGuildSettings(message);
			await this.setUserSettings(message);
			this.done(message);
		} else if (isAdmin && !guildEnabled) {
			await this.setGuildSettings(message);
			this.done(message);
		} else if (isAdmin && !userEnabled) {
			await this.setUserSettings(message);
			this.done(message);
		} else if (isAdmin) {
			this.done(message);
		} else if (!isAdmin && !guildEnabled) {
			this.noPermissions(message);
		} else if (!isAdmin && !userEnabled) {
			await this.setUserSettings(message);
			this.done(message);
		} else {
			this.done(message);
		}
	}
};
