import { evaluate } from "mathjs";
import Command from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgItems } from "../../utils/Constants.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class PlantcalcCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays estimated plant harvest based on time and level given",
			example: "3600 24 \"Olive Seed\"",
			args: {
				seed: {
					as: "string",
					desc: "The seed of the plant you want to harvest"
				},
				hours: {
					as: "number",
					desc: "How many hours you want your seed to be planted for"
				},
				points: {
					as: "number",
					desc: "The number of points assigned to the Reaping attribute",
					optional: true
				}
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { seed: string, hours: number, points?: number };
		const points = args.points || 0;
		const seed = args.seed.toLowerCase();

		const item = Object.values(drpgItems)
			.find(e => e.sapling && e.name.toLowerCase().includes(seed));

		if (item && item.sapling) {
			const scope = { luck: points, passed: args.hours * 3600 };
			const min = evaluate(item.sapling.loot.amount.min, scope);
			const max = evaluate(item.sapling.loot.amount.max, scope);
			ctx.reply(`Estimated ${min} - ${max} when planted for ${args.hours} hours. `);
		} else {
			ctx.error("WRONG_USAGE", "You need to provide the name of a valid sapling.");
		}
	}
};
