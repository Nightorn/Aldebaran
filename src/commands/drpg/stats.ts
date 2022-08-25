import request from "request";
import Command from "../../groups/DRPGCommand.js";
import { getTimeString } from "../../utils/Methods.js";
import { drpgLocationdb } from "../../utils/Constants.js";
import { User } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

export default class StatsCommand extends Command {
	constructor() {
		super({
			description: "Displays a DiscordRPG user's character and pet infos",
			example: "141610251299454976",
			args: { user: {
				as: "user",
				desc: "The user whose stats you want to see",
				optional: true
			} }
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.fetchUser(args.user || ctx.author.id).then(user => {
			request({
				uri: `http://api.discorddungeons.me/v3/user/${user.id}`,
				headers: { Authorization: process.env.API_DISCORDRPG }
			}, (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					const data = JSON.parse(body).data as User;

					const format = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					const skills = [];
					const attributes = [];
					for (const [key, value] of Object.entries(data.skills))
						skills.push(`**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`);
					if (data.attributes !== undefined)
						for (const [key, value] of Object.entries(data.attributes))
							if (value !== 0) attributes.push(`**${key[0].toUpperCase() + key.slice(1)}** ${format(value)} Points`);
					const location = data.location ? drpgLocationdb[data.location.current] : "The Abyss";
					const embed = new Embed()
						.setAuthor({ name: data.name, iconURL: user.avatarURL })
						.setColor(data.donate ? "Gold" : "#00ae86")
						.setDescription(`Currently In **${location || "The Abyss"}**`)
						.addField(
							`Level ${format(data.level)}`,
							`**Progression** - ${format(data.kills)} **Kills** | ${
								data.deaths
							} **Deaths** | ${format(
								data.xp
							)} **XP**\n**Currency** - ${format(data.gold)} **Gold** | ${
								data.lux !== undefined ? format(data.lux) : "0"
							} **Lux**`,
							false
						)
						.addField(
							"Specifications",
							`**__Skills__** - ${skills.join(", ")}\n**__Attributes__** - ${
								attributes.length !== 0 ? attributes.join(", ") : "None"
							}`
						)
						.setFooter({
							text: `${data.donate ? "Donator, " : ""}Last seen ${getTimeString(Date.now() - data.lastseen, "DD day(s), HH hour(s), MM minute(s) and SS second(s)")} ago`
						});
					if (data.quest && (data.quest.current || data.quest.completed)) {
						embed.addField(
							"Quests",
							`${
								data.quest.current !== null
									? `**Current** : ${data.quest.current.name}\n`
									: ""
							}${
								data.quest.completed !== undefined
									? `**Completed (${
										data.quest.completed.length
									})** : ${data.quest.completed.join(", ")}`
									: ""
							}`,
							false
						);
					}
					if (data.pet !== undefined)
						if (data.pet.xp !== undefined) embed.addField(
							`Pet (${data.pet.type})`,
							`**Name** : ${data.pet.name} | **Level** ${format(
								data.pet.level
							)}\n${format(data.pet.xp)} **XP** (XP Rate : ${
								data.pet.xprate === undefined ? 0 : data.pet.xprate
							}%) | **Damages** : [${format(
								data.pet.damage.min
							)} - ${format(data.pet.damage.max)}]`,
							false
						);
					ctx.reply(embed);
				} else {
					ctx.reply("the DiscordRPG API seems down, please retry later.");
				}
			});
		}).catch(() => {
			ctx.reply("the ID of the user you specified is invalid. Please retry by mentioning them or by getting their right ID.");
		});
	}
}
