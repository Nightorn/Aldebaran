const { Command, Embed } = require("../../groups/DRPGCommand");

module.exports = class GoldCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays the number of upgrades you need for your weapon",
			example: "400 386 7283 7408 1050 1.56 2",
			args: {
				charLevel: { as: "number" },
				petLevel: { as: "number" },
				minPetDamage: { as: "number" },
				maxPetDamage: { as: "number" },
				minWeaponDamage: { as: "number" },
				maxWeaponDamage: { as: "number" },
				strMultiplier: { as: "number?" },
				shots: { as: "number?" }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const upgrades = Math.ceil(((
			(((args.charLevel * 50) - 10 + (args.maxPetDamage > args.petLevel * 10
				? args.maxPetDamage - args.petLevel * 10 : 0
			)) / (args.shots || 1) - args.minPetDamage)
			/ (args.strMultiplier || 1) / args.minWeaponDamage) - 1) * 4);
		const cost = Math.floor(
			(args.minWeaponDamage + args.maxWeaponDamage)
			/ 6.5 * 50 * upgrades * (upgrades + 1)
			* ((2 * upgrades + 1) / 6) + 500 * upgrades
		);
		const embed = new Embed(this)
			.setTitle("Upgrade Cost")
			.setDescription(`**Character's Weapon Stats** (Lv**${args.charLevel.toLocaleString()}**): Deals between **${args.minWeaponDamage.toLocaleString()}** and **${args.maxWeaponDamage.toLocaleString()}** damage\n**Pet Stats** (Lv**${args.petLevel.toLocaleString()}**): Deals between **${args.minPetDamage.toLocaleString()}** and **${args.maxPetDamage.toLocaleString()}** damage`)
			.addField("Upgrades Needed", `**${upgrades}** Upgrades`, true)
			.addField("Required Strength", `**${(upgrades * 15).toLocaleString()}** Points`, true)
			.addField("Upgrades Cost", `**${cost.toLocaleString()}** Gold`, true);
		message.channel.send({ embed });
	}
};
