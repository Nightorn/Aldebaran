import { MessageEmbed } from "discord.js";

import Pollux from "../utils/bots/Pollux.js";
import DiscordRPG from "../utils/bots/DiscordRPG.js";
import DRPGAdventure from "../utils/timer/DiscordRPG/adv.js";
import DRPGSides from "../utils/timer/DiscordRPG/sides.js";
import DRPGPadventure from "../utils/timer/DiscordRPG/padv.js";
import AldebaranClient from "../structures/djs/Client.js";
import Message from "../structures/djs/Message.js";

// eslint-disable-next-line import/prefer-default-export
export const run = async (bot: AldebaranClient, message: Message) => {
	if (!message.guild) return;
	if (!message.guild.ready) await message.guild.fetch();
	if (!message.author.ready) await message.author.fetch();
	if (message.author.banned) return;
	if (message.guild.settings.aldebaran === "off") {
		setTimeout(() => {
			message.guild.changeSetting("aldebaran", "on");
		}, 60000);
		return;
	}
	if (message.author.id === "271394014358405121") Pollux(bot, message);
	else if (message.author.id === "170915625722576896") {
		DiscordRPG(bot, message);
	} else if (!message.author.bot) {
		DRPGAdventure(message);
		DRPGSides(message);
		DRPGPadventure(message);
		const drpgMatch = message.content.toLowerCase().match(/.+(?=stats|adv)/);
		if (drpgMatch !== null) {
			const filter = (msg: Message) => msg.author.id === "170915625722576896";
			message.channel.awaitMessages(filter, { max: 1, time: 2000 })
				.then(() => {
					if (message.guild.settings.discordrpgprefix === undefined)
						message.guild.settings.discordrpgprefix = drpgMatch[0];
				});
		}
	}

	if (message.author.bot) return;
	const prefix = process.argv[2] === "dev" ? process.argv[3] || process.env.PREFIX! : message.guild.prefix;
	if (message.content.indexOf(prefix) !== 0) return;
	if (message.content.slice(prefix.length)[0] === " ") return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift()!.toLowerCase();

	try {
		const sliced = command.slice(1);
		if (command.indexOf("?") === 0) {
			message.channel.send({
				embed: bot.commands.getHelp(sliced, prefix)
			});
		} else if (command.indexOf("#") === 0) {
			try {
				bot.commands.bypassRun(sliced, message);
			} catch (err) {
				if (err.message === "INVALID_COMMAND") return;
				if (err.message === "UNALLOWED_ADMIN_BYPASS") {
					const embed = new MessageEmbed()
						.setTitle("You are not allowed to use this.")
						.setDescription(
							"By using `#`, you are trying to bypass Discord permissions requirements and other checks, which is only allowed for Aldebaran Administrators."
						)
						.setFooter(message.author.username, message.author.pfp())
						.setColor("RED");
					message.channel.send({ embed });
				} else {
					console.error(err);
				}
			}
		} else if (command.indexOf("-") === 0) {
			try {
				const cmd: any = bot.commands.get(sliced);
				if (cmd && cmd.image) {
					cmd.image(bot, message, args);
				}
			} catch (err) {
				const embed = new MessageEmbed()
					.setTitle("The requested resource has not been found.")
					.setDescription("By using `-`, you are trying to view the image version of this command, however, the image version of this command is not available. Try again without `-`.")
					.setFooter(message.author.username, message.author.pfp())
					.setColor("RED");
				message.channel.send({ embed });
			}
		} else {
			bot.commands.execute(command, message);
		}
		console.log(
			`\x1b[34m- COMMAND: ${command} | USER: ${message.author.tag} (${
				message.author.id
			}) | ARGS: ${args.join(" ") || "None"}\x1b[0m`
		);
	} catch (err) {
		if (err.message === "INVALID_PERMISSIONS") {
			const embed = new MessageEmbed()
				.setTitle("You are not allowed to use this.")
				.setDescription(`This command requires permissions that you do not currently have. Please check \`${prefix}?${command}\` for more informations about the requirements to use this command.`)
				.setFooter(message.author.username, message.author.pfp())
				.setColor("RED");
			message.channel.send({ embed });
		} else if (err.message === "NOT_NSFW_CHANNEL") {
			const embed = new MessageEmbed()
				.setTitle("You are using this command incorrectly.")
				.setDescription(
					"As this command shows NSFW content, you need to use this command in a NSFW channel."
				)
				.setFooter(message.author.username, message.author.pfp())
				.setColor("RED");
			message.channel.send({ embed });
		} else if (err.message !== "INVALID_COMMAND") {
			console.error(err);
		}
	}
};
