import { MessageEmbed } from "discord.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import { imageUrls } from "../../utils/Constants.js";
import User from "../../structures/djs/User.js";

const senddeath = imageUrls
	.deathimage[Math.floor(Math.random() * imageUrls.deathimage.length)];

const embedColor = (playerPercentage: number) => {
	if (playerPercentage <= 20) return "RED";
	if (playerPercentage <= 40) return "ORANGE";
	if (playerPercentage <= 60) return "YELLOW";
	return "GREEN";
};

const emojiColor = (percentage: number) => {
	if (percentage <= 20) return "🔴";
	if (percentage <= 40) return "🟠";
	if (percentage <= 60) return "🟡";
	return "🟢";
};

const checkPlayer = (ctx: DiscordMessageContext, username: string) => {
	const match = ctx.channel.messages.cache
		.filter(m => m.author.username === username).first();
	if (match) return ctx.client.customUsers.fetch(match.author.id);
	return null;
};

const general = (
	user: User,
	playerHP: number,
	petHP: string | number,
	ctx: DiscordMessageContext
) => {
	const { healthmonitor, individualhealthmonitor } = user.settings;
	if (user === null) return;
	if (healthmonitor && healthmonitor !== "off") {
		const embed = new MessageEmbed()
			.setAuthor({
				name: user.username,
				iconURL: user.user.displayAvatarURL()
			})
			.setColor(embedColor(playerHP as number));
		if (["character", "pet"].indexOf(individualhealthmonitor!) !== -1) {
			if (individualhealthmonitor === "character") {
				embed.addField("__Character Health__", `${emojiColor(playerHP)} **${playerHP}%**`, true);
			} else {
				embed.addField("__Pet Health__", petHP === 0 ? "**DEAD**" : `${emojiColor(petHP as number)} **${petHP}**%`, true);
			}
		} else {
			embed.addField("__Character Health__", `${emojiColor(playerHP)} **${playerHP}%**`, true);
			embed.addField(
				"__Pet Health__",
				petHP === "Dead" ? "**DEAD**" : `${emojiColor(petHP as number)} **${petHP}%**`,
				true
			);
		}
		ctx.reply(embed);
	}
};

const playerWarning = (user: User, hp: number, ctx: DiscordMessageContext) => {
	const embed = new MessageEmbed()
		.setTitle(`__${user.username} Health Warning!!! - ${hp}%__`)
		.setColor(0xff0000)
		.setDescription(`**${user.username}** is at __**${hp}%**__ health!!!\n`)
		.setImage(senddeath)
		.setFooter({ text: "Pay attention to your health or you are going to die!" });
	ctx.reply(embed).then(msg => setTimeout(() => msg.delete(), 60000));
};

const petWarning = (user: User, hp: number, ctx: DiscordMessageContext) => {
	const embed = new MessageEmbed()
		.setTitle(`${user.username} PET Health Warning!!! - ${hp}%__`)
		.setColor(0xff0000)
		.setDescription(
			`**${user.username}** your pet is at __**${hp}%**__ health!!!\n`
		)
		.setImage(senddeath)
		.setFooter({
			text: "Your pet is getting very weak, take care of it quickly!"
		});
	ctx.reply(embed).then(msg => setTimeout(() => msg.delete(), 60000));
};

async function percentageCheck(
	name: string,
	ctx: DiscordMessageContext,
	player: number,
	pet: number
) {
	const user = await checkPlayer(ctx, name);
	if (user) {
		const { healthmonitor, individualhealthmonitor } = user.settings;
		const percentage = !isNaN(Number(healthmonitor)) ? Number(healthmonitor) : 100;
		if (healthmonitor === undefined || healthmonitor === "off") return false;
		if (["character", "pet"].indexOf(individualhealthmonitor!) !== -1) {
			if (individualhealthmonitor === "character") {
				if (player <= percentage) {
					if (player <= 11) return playerWarning(user, player, ctx);
					return general(user, player, pet, ctx);
				}
			} else if (pet <= percentage) {
				if (pet <= 11) return petWarning(user, pet, ctx);
				return general(user, player, pet, ctx);
			}
		} else if (player <= percentage || pet <= percentage) {
			if (player <= 11) return playerWarning(user, player, ctx);
			if (pet <= 11 && pet !== 0) return petWarning(user, pet, ctx);
			return general(user, player, pet, ctx);
		}
	}
	return false;
};

export default async (ctx: DiscordMessageContext) => {
	if (!ctx.guild) return false;
	const guild = await ctx.guild;
	if (guild.settings.healthmonitor === "off") return false;
	const player = {
		currentHP: 0,
		healthPercent: 0,
		maxHP: 0,
		name: "null"
	};
	const pet = {
		currentHP: 0,
		healthPercent: 0,
		maxHP: 0
	};
	if (ctx.embeds.length === 0) {
		if (ctx.content.includes("'s Adventure")
			|| ctx.content.includes("Party Adventure")
		) {
			let content = ctx.content;
			if (ctx.content.indexOf(") | +") !== -1) {
				const match = content.match(/Rolled a \d\n[+-] (.*): *[\d.]+% HP/);
				if (match) player.name = match[1];
				// eslint-disable-next-line no-useless-escape
				const hpMatches = content.match(/(Dead|[\d\.]+% HP)/g)!;
				const deadPet = hpMatches[1] === "Dead";
				// eslint-disable-next-line no-param-reassign
				content = content.replace(/%/g, "");
				return percentageCheck(
					player.name,
					ctx,
					parseInt(hpMatches[0].split(" ")[0], 10),
					deadPet ? 0 : parseInt(hpMatches[1].split(" ")[0], 10)
				);
			}
			const healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
			const namePattern = /\+ (.*) has [\d,]+\/[\d,]+ HP left\./;
			const healthMessage = content.match(healthMessagePattern);
			if (healthMessage && content.match(namePattern)) {
				const nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/)!;
				player.currentHP = Number(nums[1].replace(/,/g, ""));
				player.maxHP = Number(nums[2].replace(/,/g, ""));
				player.name = content.match(namePattern)![1];
			}
			const messageArray = content.split("\n");
			let dealtLine = null;
			let tookLine = null;
			for (const i in messageArray) {
				if (messageArray[i].indexOf(" dealt ") !== -1) {
					dealtLine = parseInt(i, 10);
				}
				if (messageArray[i].indexOf(" took ") !== -1) {
					tookLine = parseInt(i, 10);
				}
			}
			if (tookLine === dealtLine! + 1) {
				const petInfosLine = messageArray[tookLine + 1].split(" ");
				pet.currentHP = parseInt(
					petInfosLine[petInfosLine.indexOf("has") + 1]
						.split("/")[0]
						.replace(",", ""),
					10
				);
				pet.maxHP = parseInt(
					petInfosLine[petInfosLine.indexOf("has") + 1]
						.split("/")[1]
						.replace(",", ""),
					10
				);
			}
		}
	} else if (
		ctx.embeds[0].author !== undefined
		&& ctx.embeds[0].author !== null
	) {
		const adventureEmbed = ctx.embeds[0];
		if (ctx.embeds[0].author.name!.includes("Adventure")) {
			const petData = adventureEmbed.fields[
				adventureEmbed.fields[1].name === "Critical Hit!" ? 2 : 1
			].value.split("\n")[2];
			if (petData) {
				player.name = adventureEmbed.fields[0].name;
				const split = petData.split(" ")[1].split("/");
				pet.currentHP = Number(split[0].replace(",", ""));
				pet.maxHP = Number(split[1].replace(",", ""));
				const healthLine = adventureEmbed.fields[0].value.match(/Has ([\d,]+)\/([\d,]+) HP left/)!;
				player.currentHP = Number(healthLine[1].replace(/,/g, ""));
				player.maxHP = Number(healthLine[2].replace(/,/g, ""));
			}
		}
	}

	const user = await checkPlayer(ctx, player.name);
	if (user === null) return false;
	player.healthPercent = Math
		.round((1000 * player.currentHP) / player.maxHP) / 10;
	pet.healthPercent = Math.round((10 * pet.currentHP * 100) / pet.maxHP) / 10;
	if (
		user !== undefined
    && player.name !== undefined
    && player.healthPercent !== pet.healthPercent
	) {
		if (user.settings.healthmonitor === "off") return false;

		percentageCheck(
			player.name,
			ctx,
			player.healthPercent,
			pet.healthPercent
		);
	}
	return false;
};
