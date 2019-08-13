const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/DRPGCategory");
const itemlist = require("../../Data/drpgitemlist.json").data;

module.exports = class WeaponCommand extends Command {
	constructor(client) {
		super(client, {
			name: "weapon",
			description: "Recommends you the best weapons for your level",
			usage: "Level",
			example: "150"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const level = (args.length > 0) ? parseInt(args[0], 10) : 1;
		const levelmax = (level + 1) * 1.5;
		const levelmin = Math.floor(level * 0.90);

		let allWeapons = new Map();
		const exactWeaponLevelFound = new Map();
		for (let i = 0; i < itemlist.length; i++) {
			if (itemlist[i].type === "weapon" && itemlist[i].cost > 0) {
				allWeapons.set(itemlist[i], itemlist[i].level);
			}
		}

		// eslint-disable-next-line func-names
		allWeapons[Symbol.iterator] = function* () {
			yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
		};

		for (const [weapon, weaponLevel] of allWeapons) {
			if (weaponLevel < levelmin || weaponLevel > levelmax) {
				allWeapons.delete(weapon);
			} else if (weaponLevel === level) {
				exactWeaponLevelFound.set(weapon, weaponLevel);
			}
		}

		const embed = new MessageEmbed()
			.setTitle(`Obtainable Weapons Available At Level ${level}`)
			.setAuthor(message.author.username, message.author.avatarURL())
			.setColor(0x00AE86)
			.setDescription("Will display weapon available at level specfied, unless none exist which will return close matches above and below level specfied.");
		if (exactWeaponLevelFound.size !== 0) allWeapons = exactWeaponLevelFound;
		if (args[0] === 100) embed.addField("__*Blue Ceremonial Card*__ - Lvl. 100", "Given to all players who have reached Level 100. Contains the memories of the player gained from their adventure.\n**Price:** Free using **__*getcard*__** command.\n**Damage:** 333 - 377", false);
		for (const [weapon] of allWeapons) embed.addField(`__*${weapon.name} - Lvl.${weapon.level}*__`, `*${weapon.desc}*\n**Price:** ${weapon.cost} gold\n**Damage:** ${weapon.weapon.dmg.min} - ${weapon.weapon.dmg.max}\n**ItemID:** ${weapon.id}`, false);
		message.channel.send(embed);
	}
};
