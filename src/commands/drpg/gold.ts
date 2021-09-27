import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { formatNumber } from "../../utils/Methods.js";

export default class GoldCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays the estimated gold per kill at a certain level",
			usage: "Level EquipmentBoost GoldboostPoints",
			example: "323 18 max"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const level = parseInt(args[0], 10);
		let attributes = 0;
		if (args[2] !== undefined) {
			if (args[2] === "max") attributes = 6969696969696966696969696969;
			else attributes = parseInt(args[2], 10);
		}
		const equipment = args[1] !== undefined ? parseInt(args[1], 10) : 0;
		if (
			!Number.isNaN(level)
		&& !Number.isNaN(attributes)
		&& !Number.isNaN(equipment)
		) {
			if (attributes > level * 5) attributes = level * 5;
			const baseGold = level < 22
				? level * 4 : (50 + (level - 55) * 8 + 200 + level * 8) / 2;

			const getGold = (ring = 1) => Math.round((baseGold * (
				1 + (Math.floor(attributes / 10) + equipment) / 100)
				+ level) * ring);

			const embed = new MessageEmbed()
				.setTitle("Average Obtained Gold")
				.setAuthor(ctx.message.author.username, ctx.message.author.displayAvatarURL())
				.setColor(0x00ae86)
				.setDescription(
					`**Please note all infomation about Gold are estimations!**\nYou have a +${equipment}% Gold Boost on your equipment, and you have ${attributes} points in the Gold Boost attribute.`
				)
				.addField(
					"**With a donor ring of Gold (x1.5)**",
					`${formatNumber(getGold(1.5))} Gold per kill on average`,
					true
				)
				.addField(
					"**With an enchanted donor ring of Gold (x1.56)**",
					`${formatNumber(getGold(1.56))} Gold per kill on average`,
					true
				)
				.addField(
					"**Without a ring of Gold**",
					`${formatNumber(getGold())} Gold per kill on average`
				);
			ctx.reply(embed);
		} else {
			ctx.reply("You need to specify a level and the Gold Boost percentage the used equipment has (if you want to take it in account).");
		}
		return true;
	}
};
