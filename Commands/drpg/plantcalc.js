const math = require("mathjs");
const { Command } = require("../../structures/categories/DRPGCategory");
const itemList = require("../../Data/drpgitemlist.json").data;

module.exports = class PlantcalcCommand extends Command {
	constructor(client) {
		super(client, {
			name: "plantcalc",
			description: "Displays estimated plant harvest based on time an level given",
			usage: "ReapingPoints Hours ItemName",
			example: "3600 24 Olive Seed"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args.length >= 3) {
			const points = args.shift();
			const hours = parseInt(args.shift(), 10);
			const itemName = args.join(" ");
			let item = null;
			itemList.forEach(element => {
				if (element.name.toLowerCase() === itemName) item = element;
			});
			const scope = { luck: points, passed: hours * 3600 };
			const min = math.eval(item.sapling.loot.amount.min, scope);
			const max = math.eval(item.sapling.loot.amount.max, scope);
			message.channel.send(`Estimated ${min} - ${max} when planted for ${hours} hours. `);
		} else message.channel.send("You must provide reaping points, hours set and item name. Example (&plantcalc 1 24 olive)");
	}
};
