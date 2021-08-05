import request from "request";
import { evaluate } from "mathjs";
import { Command, Embed } from "../../groups/DRPGCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";
import User from "../../structures/djs/User.js";
import { drpgItems, drpgLocationdb } from "../../utils/Constants.js";

export default class PlantCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Displays users plant informations and estimated loots",
			usage: "UserMention|UserID",
			example: "320933389513523220",
			args: { user: { as: "user" }, plant: { as: "number" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(bot: AldebaranClient, message: Message, args: any) {
		const userid = args.user || message.author.id;
		const plantId = args.plant || null;
		request({
			uri: `http://api.discorddungeons.me/v3/user/${userid}`,
			headers: { Authorization: process.env.API_DISCORDRPG }
		}, async (err, response, body) => {
			if (err) throw err;
			if (response.statusCode === 404) {
				message.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
			} else if (response.statusCode === 200) {
				const target = (await bot.users.fetch(userid)) as User;
				const { data } = JSON.parse(body);
				if (data.location === undefined) return message.channel.send(`Hey **${data.name}**, travel somewhere and set a trap on your way!`);
				if (data.location.saplings === null || data.location.saplings === undefined) return message.channel.send(`Hey **${data.name}**, please plant some saplings at your purchased fields before!`);
				const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
				const getDate = (time: number, md?: boolean) => {
					const date = new Date(time);
					return md
						? `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`
						: `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
				};
				const plants: { [key: string]: any } = data.location.saplings;
				if (plantId !== null) {
					const plant = plants[plantId];
					if (plant) {
						const item = drpgItems[plant.id];
						const passed = (Date.now() - plant.time) / 1000;
						let luck = data.attributes.reaping;
						if (luck === 0) luck = 1;
						const luckMax = data.level * 5;
						const skillLevel = data.skills.forage.level;
						const scope = { luck, passed, skillLevel };
						const scopeMax = { luck: luckMax, passed, skillLevel };
						const loots = item.sapling!.loot.amount;
						const normalMin = evaluate(loots.min, scope);
						const normalMax = evaluate(loots.max, scope);
						const highestMin = evaluate(loots.min, scopeMax);
						const highestMax = evaluate(loots.max, scopeMax);
						const rewardName = drpgItems[item.sapling!.loot.id[0]].name;
						const normalRewards = normalMin === normalMax
							? `**${normalMin} ${rewardName}**`
							: `between **${normalMin}** and **${normalMax} ${rewardName}**`;
						const highestRewards = highestMin === highestMax
							? `**${highestMin} ${rewardName}**`
							: `between **${highestMin}** and **${highestMax} ${rewardName}**`;
						const pronoun = message.author.id === userid ? "You" : "They";
						const ownership = message.author.id === userid ? "your" : "their";
						const embed = new Embed(this)
							.setAuthor(`${target.username}  |  Plant Informations  |  ${item.name} @ ${drpgLocationdb[plantId]}`, target.pfp())
							.setDescription(`With ${ownership} current reaping skills (${luck === 1 ? 0 : luck} points), ${pronoun} will receive ${normalRewards}. With the highest reaping skills possible for ${ownership} level (${luckMax} points) ${pronoun.toLowerCase()} could have, ${pronoun.toLowerCase()} will receive ${highestRewards}.`)
							.setFooter(`${pronoun} have set this plant the ${getDate(plant.time)}.`);
						message.channel.send({ embed });
					} else {
						message.channel.error("NOT_FOUND", `You have specified a location where there is no sapling. Make sure you are checking the right location by using \`${message.guild.prefix}plant\`.`, "location");
					}
				} else {
					let plantsList = "";
					for (const [location, plant] of Object.entries(plants)) {
						if (plant !== null)
							if (plant.id !== "")
								plantsList += `\`[${location}]\` **${drpgItems[plant.id].name}** @ **${drpgLocationdb[location]}** - ${getDate(plant.time, true)}\n`;
					}
					if (plantsList !== "") {
						const embed = new Embed(this)
							.setAuthor(`${target.username}  |  Sapling Informations`, target.pfp())
							.setDescription(`${message.author.id === userid ? "You have" : `**${target.username}** has`} **${plantsList.match(/\n/g)!.length} plants** set. Please tell us which one you want to view the informations of. Use \`${message.guild.prefix}plant 4\` for example.\n${plantsList}`);
						message.channel.send({ embed });
					} else {
						const embed = new Embed(this)
							.setAuthor(`${target.username}  |  Sapling Informations`, target.pfp())
							.setDescription(`${message.author.id === userid ? "You have" : `**${target.username}** has`} no plant set.`);
						message.channel.send({ embed });
					}
				}
			} else {
				message.reply("the DiscordRPG API seems down, please retry later.");
			}
		});
	}

	registerCheck() {
		return process.env.API_DISCORDRPG !== undefined
			&& process.env.API_DISCORDRPG !== null;
	}
};
