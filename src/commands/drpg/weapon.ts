import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
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
	run(bot: AldebaranClient, message: Message, args: any) {
		const { level } = args;
		if (level === undefined)
			return message.channel.send("You need to specify a level!");
		if (level < 1)
			return message.channel.send("You cannot search for weapons requiring a negative level!");

		let weapons = Object.values(drpgItems).filter(
			(w) => w.type === "weapon"
			&& (w.cost > 0 || ["2", "134", "447", "526", "528", "617", "641", "653", "805", "850", "851"].includes(w.id))
			&& w.id !== "13" && w.id !== "49"
		);
		weapons = weapons.sort(
			// eslint-disable-next-line no-nested-ternary
			(a: any, b: any) => a.level > b.level ? 1 : b.level > a.level ? -1 : 0
		);
		let previousWeapon = weapons[0];
		let nextWeapon = null;
		for (const weapon of weapons) {
			if (weapon.level > level) {
				nextWeapon = weapon;
				break;
			}
			previousWeapon = weapon;
		}
		weapons = [previousWeapon];
		if (nextWeapon !== null) weapons.push(nextWeapon);

		const embed = new MessageEmbed()
			.setTitle(`Obtainable Weapons Available At Level ${level}`)
			.setAuthor(message.author.username, message.author.pfp())
			.setColor(0x00AE86)
			.setDescription("Will display weapon available at level specfied, unless none exist which will return close matches above and below level specfied.");
		for (const weapon of weapons) embed.addField(`__*${weapon.name} - Lvl.${weapon.level}*__`, `*${weapon.desc}*\n**Price:** ${weapon.cost} gold\n**Damage:** ${weapon.weapon!.dmg.min} - ${weapon.weapon!.dmg.max}\n**ItemID:** ${weapon.id}`, false);
		return message.channel.send(embed);
	}
};
