import fs from "fs";
import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/DRPGCommand.js";

const questlist = JSON.parse(fs.readFileSync("../../assets/data/drpgquestinfo.json"));

export default class QuestCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays the DiscordRPG quests list and detailled informations about each quest",
			usage: "QuestName",
			example: "Cult of MOUKN"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const questrequest = args.join(" ").toLowerCase(); let
			found = false;
		if (args.length === 0) {
			for (const [name, quest] of Object.entries(questlist)) {
				if (name === questrequest) {
					found = true;
					let walktrough = "";
					let itemsNeeded = "";
					let rewards = "";
					for (const [step, details] of Object.entries(quest.steps)) walktrough += `**${step}:** ${details}\n`;
					for (const [id, details] of Object.entries(quest.itemsNeeded)) itemsNeeded += `**${id}:** **${details.item}** (${details.qty}) - ${details.buyable ? `Buyable for ${details.price}` : "Not buyable, or only on global market"}\n`;
					for (const [id, reward] of Object.entries(quest.rewards)) rewards += `**${id}:** ${reward}\n`;
					const embed = new MessageEmbed()
						.setAuthor(message.author.username, message.author.avatarURL())
						.setTitle(`${quest.name} Quest`)
						.setColor(0xff6699)
						.setDescription(`Details for the ${quest.name} Quest`);
					if (quest.warning !== undefined) embed.addField("**__Warnings__**", quest.warning, false);
					embed.addField("**__Starting Location__**", quest.startPoint, true);
					embed.addField("**__Starting NPC__**", quest.startNpc, true);
					if (walktrough !== "") embed.addField("**__Walktrough__**", walktrough, true);
					if (itemsNeeded !== "") embed.addField("**__Items Needed__**", itemsNeeded, true);
					if (rewards !== "") embed.addField("**__Rewards__**", rewards, true);
					message.channel.send({ embed });
				}
			}
			if (!found) message.channel.send("**Error** No Quest Found. Either you mispelled the title of the quest");
		} else {
			const embed = new MessageEmbed()
				.setTitle("DRPG Quest List")
				.setAuthor(message.author.username, message.author.avatarURL())
				.setColor(0x00AE86)
				.setDescription("Use &quest <questname> to view walkthrough.")
				.addField("**__Non-Members Quest__**", "🔺 Cult of MOUKN | 🔺 Fickle Fishing | 🔺 The Cold North\n🔺 The quest about wood? | 🔺 Meditative Magic | 🔺 Exotic Eggnog\n🔺 The Land Above", false)
				.addField("**__Members Only Quest__**", "🔺 Baffling Baking | 🔺 Dragon Slayer | 🔺 Menu Specials\n🔺 Bakoushi's Bunny | 🔺 Mystic Gravestone", false)
				.setFooter("Work in progress");
			message.channel.send({ embed });
		}
	}
};
