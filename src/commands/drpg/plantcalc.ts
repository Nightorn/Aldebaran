import { evaluate } from "mathjs";
import { Command } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgItems } from "../../utils/Constants.js";
import { DRPGItem } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";

export default class PlantcalcCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays estimated plant harvest based on time an level given",
			usage: "ReapingPoints Hours ItemName",
			example: "3600 24 Olive Seed"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args.length >= 3) {
			const points = args.shift();
			const hours = parseInt(args.shift()!, 10);
			const itemName = args.join(" ");
			let item: DRPGItem | null = null;
			for (const element of Object.values(drpgItems))
				if (element.name.toLowerCase() === itemName) item = element;
			if (item && item.sapling) {
				const scope = { luck: points, passed: hours * 3600 };
				const min = evaluate(item.sapling.loot.amount.min, scope);
				const max = evaluate(item.sapling.loot.amount.max, scope);
				ctx.reply(`Estimated ${min} - ${max} when planted for ${hours} hours. `);
			} else ctx.error("WRONG_USAGE", "You need to provide the name of a valid sapling.");
		} else ctx.reply("You must provide reaping points, hours set and item name. Example (&plantcalc 1 24 olive)");
	}
};
