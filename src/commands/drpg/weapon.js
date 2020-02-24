const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/DRPGCommand");
const itemlist = require("../../../assets/data/drpg/itemList.json");

module.exports = class WeaponCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Recommends you the best weapons for your level",
			usage: "Level",
			example: "150",
			args: { level: { as: "number" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const { level } = args;
		if (level === undefined)
			return message.channel.send("You need to specify a level!");
		if (level < 1)
			return message.channel.send("You cannot search for weapons requiring a negative level!");

		let weapons = Object.values(itemlist).filter(
			w => w.type === "weapon"
			&& (w.cost > 0 || ["2", "617", "134", "641", "526", "653", "805"].includes(w.id))
			&& w.id !== "13"
		);
		weapons = weapons.sort(
			// eslint-disable-next-line no-nested-ternary
			(a, b) => a.level > b.level ? 1 : b.level > a.level ? -1 : 0
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
			.setAuthor(message.author.username, message.author.avatarURL())
			.setColor(0x00AE86)
			.setDescription("Will display weapon available at level specfied, unless none exist which will return close matches above and below level specfied.");
		for (const weapon of weapons) embed.addField(`__*${weapon.name} - Lvl.${weapon.level}*__`, `*${weapon.desc}*\n**Price:** ${weapon.cost} gold\n**Damage:** ${weapon.weapon.dmg.min} - ${weapon.weapon.dmg.max}\n**ItemID:** ${weapon.id}`, false);
		return message.channel.send(embed);
	}
};
