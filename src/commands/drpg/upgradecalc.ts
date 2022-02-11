import { Command, Embed } from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class UpgradecalcCommand extends Command {
	constructor(client: AldebaranClient) {
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
				strMultiplier: { as: "number", optional: true },
				shots: { as: "number", optional: true }
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as {
			charLevel: string,
			petLevel: string,
			minPetDamage: string,
			maxPetDamage: string,
			minWeaponDamage: string,
			maxWeaponDamage: string,
			strMultiplier?: string,
			shots?: string
		};

		const charLevel = Number(args.charLevel);
		const petLevel = Number(args.petLevel);
		const maxPetDMG = Number(args.maxPetDamage);
		const minPetDMG = Number(args.minPetDamage);
		const maxWeaponDMG = Number(args.maxWeaponDamage);
		const minWeaponDMG = Number(args.minWeaponDamage);
		const shots = args.shots ? Number(args.shots) : 1;
		const strMultiplier = args.strMultiplier ? Number(args.strMultiplier) : 1;

		const petDamage = maxPetDMG > petLevel * 10 ? maxPetDMG - petLevel * 10 : 0;
		const hp = ((charLevel * 50) - 10 + petDamage); // I don't actually know what that is
		const upgrades = Math.ceil((((hp / (shots || 1) - minPetDMG)
			/ (strMultiplier || 1) / minWeaponDMG) - 1) * 4);
		const cost = Math.floor((minWeaponDMG + maxWeaponDMG)
			/ 6.5 * 50 * upgrades * (upgrades + 1)
			* ((2 * upgrades + 1) / 6) + 500 * upgrades);
		const embed = new Embed(this)
			.setTitle("Upgrade Cost")
			.setDescription(`**Character's Weapon Stats** (Lv**${charLevel.toLocaleString()}**): Deals between **${minWeaponDMG.toLocaleString()}** and **${maxWeaponDMG.toLocaleString()}** damage\n**Pet Stats** (Lv**${petLevel.toLocaleString()}**): Deals between **${minPetDMG.toLocaleString()}** and **${maxPetDMG.toLocaleString()}** damage`)
			.addField("Upgrades Needed", `**${upgrades}** Upgrades`, true)
			.addField("Required Strength", `**${(upgrades * 15).toLocaleString()}** Points`, true)
			.addField("Upgrades Cost", `**${cost.toLocaleString()}** Gold`, true)
			.setFooter("Credits to Kalle#5105 for the upgradecalc blargbot tag!");
		ctx.reply(embed);
	}
};
