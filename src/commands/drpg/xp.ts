import Command from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { formatNumber } from "../../utils/Methods.js";

export default class XpCommand extends Command {
	constructor() {
		super({
			description: "Displays estimated XP per kill at a certain level",
			example: "323 18 max",
			args: {
				level: { as: "number", desc: "The character level" },
				boost: {
					as: "number",
					desc: "Your equipment XP Boost bonus",
					optional: true
				},
				points: {
					as: "number",
					desc: "The number of points assigned to the XP Boost attribute",
					optional: true
				}
			}
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { level: number, boost: number, points?: number };
		const { level } = args;
		const enchant = args.boost || 0;
		const attrib = Math.min(args.points || 0, level * 5);

		const baseXP = level < 22
			? level * 5
			: (50 + (level - 55) * 2.719047619 + 200 + level * 2.719047619) / 2;

		const getXP = (ring = 1) => {
			const xp = baseXP * (1 + (Math.floor(attrib / 10) + enchant) / 100) + level;
			return Math.round(xp * ring);
		};

		const embed = this.createEmbed()
			.setTitle(`Average Xp Kill At Lvl. ${level}`)
			.setDescription(
				`**Please note all infomation about XP are estimations, and only works with dynamobs!**\nYou have a +${enchant}% XP Boost on your equipment, and you have ${attrib} points in your XP Boost attribute.`
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
		ctx.reply(embed);
	}
}
