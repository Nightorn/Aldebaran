import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { formatNumber } from "../../utils/Methods.js";

export default class XpCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays estimated XP per kill at a certain level",
			usage: "Level EquipmentBonus XPBoostAttribute",
			example: "323 18 max"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot: AldebaranClient, message: Message, args: any) {
		const level = parseInt(args[0], 10);
		const enchant = args[1] !== undefined ? parseInt(args[1], 10) : 0;
		let attributes = 0;
		if (args[2] !== undefined) {
			if (args[2] === "max") attributes = 6969696969696966696969696969;
			else attributes = parseInt(args[2], 10);
		}
		if (
			!Number.isNaN(level)
		&& !Number.isNaN(enchant)
		&& !Number.isNaN(attributes)
		) {
			if (attributes > level * 5) attributes = level * 5;
			const baseXP = level < 22
				? level * 5
				: (50 + (level - 55) * 2.719047619 + 200 + level * 2.719047619) / 2;

			const getXP = (ring = 1) => Math.round(
				(baseXP * (1 + (Math.floor(attributes / 10) + enchant) / 100) + level)
				* ring
			);

			const embed = new MessageEmbed()
				.setTitle(`Average Xp Kill At Lvl. ${level}`)
				.setAuthor(message.author.username, message.author.pfp())
				.setColor(0x00ae86)
				.setDescription(
					`**Please note all infomation about XP are estimations, and only works with dynamobs!**\nYou have a +${enchant}% XP Boost on your equipment, and you have ${attributes} points in your XP Boost attribute.`
				)
				.addField(
					"**With a ring of XP (x1.25)**",
					`${formatNumber(getXP(1.25))} XP per kill on average`,
					true
				)
				.addField(
					"**With an enchanted ring of XP (x1.31)**",
					`${formatNumber(getXP(1.31))} XP per kill on average`,
					true
				)
				.addField(
					"**With a donor ring of XP (x1.5)**",
					`${formatNumber(getXP(1.5))} XP per kill on average`,
					true
				)
				.addField(
					"**With an enchanted donor ring of XP (x1.56)**",
					`${formatNumber(getXP(1.56))} XP per kill on average`,
					true
				)
				.addField(
					"**Without a ring of XP**",
					`${formatNumber(getXP())} XP per kill on average`
				);
			message.channel.send({ embed });
		} else {
			message.reply(
				"You need to specify a level and the XP Boost percentage the used equipment has (if you want to take it in account)."
			);
		}
	}
};
