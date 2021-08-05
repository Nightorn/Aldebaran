import { evaluate } from "mathjs";
import { Command } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import { DRPGItem, drpgItems } from "../../utils/Constants.js";

export default class PlantcalcCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays estimated plant harvest based on time an level given",
			usage: "ReapingPoints Hours ItemName",
			example: "3600 24 Olive Seed"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message, args: any) {
		if (args.length >= 3) {
			const points = args.shift();
			const hours = parseInt(args.shift(), 10);
			const itemName = args.join(" ");
			let item: DRPGItem | null = null;
			for (const element of Object.values(drpgItems))
				if (element.name.toLowerCase() === itemName) item = element;
			if (item && item.sapling) {
				const scope = { luck: points, passed: hours * 3600 };
				const min = evaluate(item.sapling.loot.amount.min, scope);
				const max = evaluate(item.sapling.loot.amount.max, scope);
				message.channel.send(`Estimated ${min} - ${max} when planted for ${hours} hours. `);
			} else message.channel.error("WRONG_USAGE", "You need to provide the name of a valid sapling.");
		} else message.channel.send("You must provide reaping points, hours set and item name. Example (&plantcalc 1 24 olive)");
	}
};
