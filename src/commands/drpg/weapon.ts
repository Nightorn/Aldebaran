import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DRPGCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";
import { drpgItems } from "../../utils/Constants.js";

export default class WeaponCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Recommends you the best weapons for your level",
			usage: "Level",
			example: "150",
			args: { level: { as: "number" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { level: string };
		const level = Number(args.level);

		if (level < 1)
			return ctx.reply("You cannot search for weapons requiring a negative level!");

		let weapons = Object.values(drpgItems).filter(
			w => w.type === "weapon"
			&& (w.cost > 0 || ["2", "134", "447", "526", "528", "617", "641", "653", "805", "850", "851"].includes(w.id))
			&& w.id !== "13" && w.id !== "49"
		);

		weapons = weapons.sort(
			// eslint-disable-next-line no-nested-ternary
			(a, b) => a.level > b.level ? 1 : b.level > a.level ? -1 : 0
		);

		const results = [];
		for (let i = 0; i < weapons.length; i++) {
			if (weapons[i].level >= level) {
				if (i !== 0) results.push(weapons[i - 1]);
				results.push(weapons[i]);
				if (i !== weapons.length - 1) results.push(weapons[i + 1]);
				break;
			}
		}

		const embed = new MessageEmbed()
			.setTitle(`Obtainable Weapons Available At Level ${level}`)
			.setAuthor(
				ctx.message.author.username,
				ctx.message.author.displayAvatarURL()
			)
			.setColor(0x00AE86)
			.setDescription("Will display weapon available at level specfied, unless none exist which will return close matches above and below level specfied.");
		for (const weapon of results) embed.addField(`__*${weapon.name} - Lvl.${weapon.level}*__`, `*${weapon.desc}*\n**Price:** ${weapon.cost} gold\n**Damage:** ${weapon.weapon!.dmg.min} - ${weapon.weapon!.dmg.max}\n**ItemID:** ${weapon.id}`, false);
		return ctx.reply(embed);
	}
};
