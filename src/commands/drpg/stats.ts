import request from "request";
import Command from "../../groups/DRPGCommand.js";
import { getTimeString } from "../../utils/Methods.js";
import { drpgLocationdb } from "../../utils/Constants.js";
import { User } from "../../interfaces/DiscordRPG.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";

function format(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const lastSeenFormat = "DD day(s), HH hour(s), MM minute(s) and SS second(s)";

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
				headers: { Authorization: `X-Api-Key: ${process.env.API_DISCORDRPG}` },
			}, (err, response, body) => {
				if (err) throw err;
				if (response.statusCode === 404) {
					ctx.reply("it looks like the user you specified has not started his adventure on DiscordRPG yet.");
				} else if (response.statusCode === 200) {
					const data = JSON.parse(body) as User;

					const skills = [];
					for (const [key, value] of Object.entries(data.skills)) {
						skills.push(`**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`);
					}

					const attributes = [];
					if (data.attributes) {
						for (const [key, value] of Object.entries(data.attributes)) {
							if (value !== 0) {
								attributes.push(`**${key[0].toUpperCase() + key.slice(1)}** ${format(value)} Points`);
							}
						}
					}

					const location = data.location
						? drpgLocationdb[data.location.current] || "The Abyss"
						: "The Abyss";

					const lux = data.lux ? format(data.lux) : "0";
					const deaths = `${data.deaths} **Deaths**`;
					const gold = `${format(data.gold)} **Gold**`;
					const kills = `${format(data.kills)} **Kills**`;
					const level = `Level ${format(data.level)}`;
					const xp = `${format(data.xp)} **XP**`;
					const progression = `**Progression** - ${kills} | ${deaths} | ${xp}`;
					const currency = `**Currency** - ${gold} | ${lux} **Lux**`;

					const skillsField = `**__Skills__** - ${skills.join(", ")}`;
					const attrib = attributes.length ? attributes.join(", ") : "None";
					const attribField = `**__Attributes__** - ${attrib}`;

					const donator = data.donate ? "Donator, " : "";
					const fromThen = Date.now() - data.lastseen;
					const lastSeen = getTimeString(fromThen, lastSeenFormat);
					const lastSeenField = `Last seen ${lastSeen} ago`;

					const embed = new Embed()
						.setAuthor({ name: data.name, iconURL: user.avatarURL })
						.setColor(data.donate ? "Gold" : "#00ae86")
						.setDescription(`Currently In **${location}**`)
						.addField(level, `${progression}\n${currency}`, false)
						.addField("Specifications", `${skillsField}\n${attribField}`)
						.setFooter(`${donator}${lastSeenField}`);

					if (data.quest && (data.quest.current || data.quest.completed)) {
						const curQuest = data.quest.current?.name;
						const current = curQuest ? `**Current** : ${curQuest}\n` : "";

						const quests = data.quest.completed;
						const completed = data.quest.completed
							? `**Completed (${quests.length})** : ${quests.join(", ")}`
							: ""

						embed.addField("Quests", `${current}${completed}`, false);
					}

					if (data.pet?.xp) {
						const minDmg = format(data.pet.damage.min);
						const maxDmg = format(data.pet.damage.max);
						const petXp = format(data.pet.xp);
						const xpRate = data.pet.xprate ? data.pet.xprate : 0;
						const damages = `**Damages** : [${minDmg} - ${maxDmg}]`;
						const level = `**Level** ${format(data.pet.level)}`;
						const name = `**Name** : ${data.pet.name}`;
						const pet = `Pet (${data.pet.type})`;
						const xp = `${petXp} **XP** (XP Rate : ${xpRate}%)`;
						const field = `${name} | ${level}\n${xp} | ${damages}`;
						embed.addField(pet, field, false);
					}

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
