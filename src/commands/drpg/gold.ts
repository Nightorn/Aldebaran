import Command from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { formatNumber } from "../../utils/Methods.js";

export default class GoldCommand extends Command {
	constructor() {
		super({
			description: "Displays the estimated gold per kill at a certain level",
			example: "323 18 10",
			args: {
				level: { as: "number", desc: "The character level" },
				boost: {
					as: "number",
					desc: "Your equipment Gold Boost bonus",
					optional: true
				},
				points: {
					as: "number",
					desc: "The number of points assigned to the Gold Boost attribute",
					optional: true
				}
			}
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { level: number, boost: number, points?: number };
		const { level } = args;
		const equipment = args.boost || 0;
		const attrib = Math.min(args.points || 0, level * 5);

		const baseGold = level < 22
			? level * 4
			: (50 + (level - 55) * 8 + 200 + level * 8) / 2;

		const getGold = (ring = 1) => Math.round((baseGold * (
			1 + (Math.floor(attrib / 10) + equipment) / 100)
			+ level) * ring);

		const embed = this.createEmbed(ctx)
			.setTitle("Average Obtained Gold")
			.setDescription(
				`**Please note all infomation about Gold are estimations!**\nYou have a +${equipment}% Gold Boost on your equipment, and you have ${attrib} points in the Gold Boost attribute.`
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
	}
}
