const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/SettingsCategory");

// I'm too dumb to think of how to define these constants in a function
// Please tell me where these should go honestly
const guildParameters = ["healthMonitor", "adventureTimer", "sidesTimer"];
const userParameters = ["healthMonitor", "adventureTimer", "sidesTimer"];

module.exports = class EnableDRPGCommand extends Command {
	constructor(client) {
		super(client, {
			name: "enabledrpg",
			description:
        "Utility command to enable configuration values for DiscordRPG usage"
		});
	}

	async setGuildSettings(message) {
		const { prefix } = message.guild;

		const embed = new MessageEmbed()
			.setTitle("Configuring Guild Settings")
			.setDescription(
				"**This will enable the following Guild settings:**\n"
          + "DRPG Health Monitor - `healthMonitor`"
          + "\n"
          + "DRPG Adventure Timer - `adventureTimer`"
          + "\n"
          + "DRPG Sides Timer - `sidesTimer`"
          + "\n"
          + `**Do you want to proceed?** Click :white_check_mark: to continue. You can always configure the settings in \`${prefix}gconfig\`.`
			)
			.setColor("BLUE");
		const checkMark = "✅";
		const filter = (r, u) => r.emoji.name === checkMark && u.id === message.author.id;

		const msg = await message.channel.send({ embed });
		await msg.react(checkMark);
		try {
			await msg.awaitReactions(filter, {
				time: 30000,
				max: 1,
				errors: ["time"]
			});
			guildParameters.forEach(parameter => {
				message.guild.changeSetting(parameter, "on");
			});
		} catch (err) {
			msg.reactions.removeAll();
			msg.edit("The operation has been cancelled.");
			throw err;
		}
	}

	async setUserSettings(message) {
		const { prefix } = message.guild;

		const embed = new MessageEmbed()
			.setTitle("Configuring User Settings")
			.setDescription(
				"**This will enable the following User settings:**\n"
          + "DRPG Health Monitor - `healthMonitor`"
          + "\n"
          + "DRPG Adventure Timer - `adventureTimer`"
          + "\n"
          + "DRPG Sides Timer - `sidesTimer`"
          + "\n"
          + `**Do you want to proceed?** Click :white_check_mark: to continue. You can always configure the settings in \`${prefix}uconfig\`.`
			)
			.setColor("BLUE");

		const checkMark = "✅";
		const filter = (r, u) => r.emoji.name === checkMark && u.id === message.author.id;

		const msg = await message.channel.send({ embed });
		await msg.react(checkMark);
		try {
			await msg.awaitReactions(filter, {
				time: 30000,
				max: 1,
				errors: ["time"]
			});
			userParameters.forEach(parameter => {
				message.author.changeSetting(parameter, "on");
			});
		} catch (err) {
			msg.reactions.removeAll();
			msg.edit("The operation has been cancelled.");
			throw err;
		}
	}

	done(message) {
		const { prefix } = message.guild;
		const embed = new MessageEmbed()
			.setTitle("Done!")
			.setDescription(
				"Aldebaran's DRPG features are now enabled. Feel free to use DRPG normally. Aldebaran will respond appropriately when your adventure and sides are ready, and when you have low health."
          + "\n"
          + `You can always turn off features in \`${prefix}uconfig\` and \`${prefix}gconfig\`.`
			)
			.setColor("GREEN");
		message.channel.send({ embed });
	}

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
	async run(bot, message, args) {
		const isAdmin = message.member
			.permissionsIn(message.channel)
			.has("Administrator");

		const guildEnabled = guildParameters.every(parameter => message.guild.settings[parameter] === "on");
		const userEnabled = userParameters.every(parameter => message.author.settings[parameter] === "on");

		// This is what I could think of for making it stop immediately if one of the functions
		// time out. A side effect is that errors here aren't caught properly. How does one tell a timer error
		// from a regular error with the code?
		// (Please don't approve this PR without thinking over it a little bit.)
		try {
			if (isAdmin) {
				if (!guildEnabled && !userEnabled) {
					await this.setGuildSettings(message);
					await this.setUserSettings(message);
					this.done(message);
				} else if (!guildEnabled) {
					await this.setGuildSettings(message);
					this.done(message);
				} else if (!userEnabled) {
					await this.setUserSettings(message);
					this.done(message);
				} else {
					this.done(message);
				}
			}
			if (!isAdmin) {
				if (!guildEnabled) {
					this.noPermissions(message);
				} else if (!userEnabled) {
					await this.setUserSettings(message);
					this.done(message);
				} else {
					this.done(message);
				}
			}
		} catch (err) {

		}
	}
};
