import { evaluate } from "mathjs";
import request from "request";
import Command from "../../groups/DRPGCommand.js";
import { drpgItems, drpgLocationdb } from "../../utils/Constants.js";
import { Sapling, User } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class PlantCommand extends Command {
	constructor() {
		super({
			description: "Displays users plant information and estimated loots",
			example: "320933389513523220",
			args: {
				user: {
					as: "user",
					desc: "The user whose plant information you want to see",
					optional: true
				},
				plant: {
					as: "number",
					desc: "The plant ID",
					optional: true 
				}
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { user: string, plant: string };
		const userid = args.user || ctx.author.id;
		const plantId = args.plant || null;
		request({
			uri: `http://api.discorddungeons.me/v3/user/${userid}`,
			headers: { Authorization: process.env.API_DISCORDRPG }
		}, async (err, response, body) => {
			if (err) throw err;
			if (response.statusCode === 404) {
				return ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
			} else if (response.statusCode === 200) {
				ctx.fetchUser(userid).then(target => {
					const { data } = JSON.parse(body) as { data: User };
					if (data.location === undefined) return ctx.reply(`Hey **${data.name}**, travel somewhere and set a trap on your way!`);
					if (data.location.saplings === null || data.location.saplings === undefined) return ctx.reply(`Hey **${data.name}**, please plant some saplings at your purchased fields before!`);
					const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
					const getDate = (time: number, md?: boolean) => {
						const date = new Date(time);
						return md
							? `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`
							: `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
					};
					const plants = data.location.saplings;
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
							const loots = (item.sapling as Sapling).loot.amount;
							const normalMin = evaluate(loots.min, scope);
							const normalMax = evaluate(loots.max, scope);
							const highestMin = evaluate(loots.min, scopeMax);
							const highestMax = evaluate(loots.max, scopeMax);
							const rewardName = drpgItems[(item.sapling as Sapling).loot.id[0]].name;
							const normalRewards = normalMin === normalMax
								? `**${normalMin} ${rewardName}**`
								: `between **${normalMin}** and **${normalMax} ${rewardName}**`;
							const highestRewards = highestMin === highestMax
								? `**${highestMin} ${rewardName}**`
								: `between **${highestMin}** and **${highestMax} ${rewardName}**`;
							const pronoun = ctx.author.id === userid ? "You" : "They";
							const ownership = ctx.author.id === userid ? "your" : "their";
							const embed = new Embed()
								.setAuthor({
									name: `${target.username}  |  Plant information  |  ${item.name} @ ${drpgLocationdb[plantId]}`,
									iconURL: target.avatarURL
								})
								.setColor(this.color)
								.setDescription(`With ${ownership} current reaping skills (${luck === 1 ? 0 : luck} points), ${pronoun} will receive ${normalRewards}. With the highest reaping skills possible for ${ownership} level (${luckMax} points) ${pronoun.toLowerCase()} could have, ${pronoun.toLowerCase()} will receive ${highestRewards}.`)
								.setFooter(`${pronoun} have set this plant the ${getDate(plant.time)}.`);
							return ctx.reply(embed);
						}
						return ctx.error("NOT_FOUND", `You have specified a location where there is no sapling. Make sure you are checking the right location by using \`${ctx.prefix}plant\`.`, "location");
					}
					let plantsList = "";
					for (const [location, plant] of Object.entries(plants)) {
						if (plant !== null)
							if (plant.id !== "")
								plantsList += `\`[${location}]\` **${drpgItems[plant.id].name}** @ **${drpgLocationdb[location]}** - ${getDate(plant.time, true)}\n`;
					}
					if (plantsList !== "") {
						const embed = new Embed()
							.setAuthor({
								name: `${target.username}  |  Sapling information`,
								iconURL: target.avatarURL
							})
							.setDescription(`${ctx.author.id === userid ? "You have" : `**${target.username}** has`} **${plantsList.match(/\n/g)?.length} plants** set. Please tell us which one you want to view the information of. Use \`${ctx.prefix}plant 4\` for example.\n${plantsList}`);
						return ctx.reply(embed);
					}
					const embed = new Embed()
						.setAuthor({
							name: `${target.username}  |  Sapling information`,
							iconURL: target.avatarURL
						})
						.setDescription(`${ctx.author.id === userid ? "You have" : `**${target.username}** has`} no plant set.`);
					return ctx.reply(embed);
				});
			}
			return ctx.reply("the DiscordRPG API seems down, please retry later.");
		});
	}
}
