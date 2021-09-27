import { Command, Embed } from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class GoldCommand extends Command {
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
				strMultiplier: { as: "number?" },
				shots: { as: "number?" }
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
		const upgrades = Math.ceil(((
			(((Number(args.charLevel) * 50) - 10 + (Number(args.maxPetDamage) > Number(args.petLevel) * 10
				? Number(args.maxPetDamage) - Number(args.petLevel) * 10 : 0
			)) / (Number(args.shots) || 1) - Number(args.minPetDamage))
			/ (Number(args.strMultiplier) || 1) / Number(args.minWeaponDamage)) - 1) * 4);
		const cost = Math.floor(
			(Number(args.minWeaponDamage) + Number(args.maxWeaponDamage))
			/ 6.5 * 50 * upgrades * (upgrades + 1)
			* ((2 * upgrades + 1) / 6) + 500 * upgrades
		);
		const embed = new Embed(this)
			.setTitle("Upgrade Cost")
			.setDescription(`**Character's Weapon Stats** (Lv**${args.charLevel.toLocaleString()}**): Deals between **${args.minWeaponDamage.toLocaleString()}** and **${args.maxWeaponDamage.toLocaleString()}** damage\n**Pet Stats** (Lv**${args.petLevel.toLocaleString()}**): Deals between **${args.minPetDamage.toLocaleString()}** and **${args.maxPetDamage.toLocaleString()}** damage`)
			.addField("Upgrades Needed", `**${upgrades}** Upgrades`, true)
			.addField("Required Strength", `**${(upgrades * 15).toLocaleString()}** Points`, true)
			.addField("Upgrades Cost", `**${cost.toLocaleString()}** Gold`, true);
		ctx.reply(embed);
	}
};
