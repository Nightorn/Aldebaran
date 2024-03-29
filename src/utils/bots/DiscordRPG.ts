import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import { imageUrls } from "../../utils/Constants.js";
import User from "../../structures/models/DiscordUser.js";
import Embed from "../../structures/Embed.js";

const adv3Regex = /'s Adventure ]======!\n% Rolled a \d\n[+-] /;
const adv3HealthRegex = /([\d.]+)% HP \(-[\d.]+%\) +\|/g;
const healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
const namePattern = /\+ (.*) has [\d,]+\/[\d,]+ HP left\./;

const senddeath = imageUrls
	.deathimage[Math.floor(Math.random() * imageUrls.deathimage.length)];

const embedColor = (playerPercentage: number) => {
	if (playerPercentage <= 20) return "Red";
	if (playerPercentage <= 40) return "Orange";
	if (playerPercentage <= 60) return "Yellow";
	return "Green";
};

const emojiColor = (percentage: number) => {
	if (percentage <= 20) return "🔴";
	if (percentage <= 40) return "🟠";
	if (percentage <= 60) return "🟡";
	return "🟢";
};

const general = (
	user: User,
	playerHP: number,
	petHP: number,
	ctx: DiscordMessageContext
) => {
	const embed = new Embed()
		.setAuthor({ name: user.username, iconURL: user.avatarURL })
		.setColor(embedColor(playerHP));

	const selection = user.base.getSetting("individualhealthmonitor");
	if (selection !== "pet") {
		const desc = `${emojiColor(playerHP)} **${playerHP}%**`;
		embed.addField("__Character Health__", desc, true);
	}
	if (selection !== "character" && !isNaN(petHP)) {
		const color = emojiColor(petHP);
		const desc = petHP === 0 ? "**DEAD**" : `${color} **${petHP}%**`;
		embed.addField("__Pet Health__", desc, true);
	}

	ctx.channel.send({ embeds: [embed.toDiscordEmbed()] });
};

const playerWarning = (user: User, hp: number, ctx: DiscordMessageContext) => {
	const embed = new Embed()
		.setTitle(`__${user.username} Health Warning!!! - ${hp}%__`)
		.setColor("#ff0000")
		.setDescription(`**${user.username}** is at __**${hp}%**__ health!!!\n`)
		.setImage(senddeath)
		.setFooter({ text: "Pay attention to your health or you are going to die!" });
	ctx.channel.send({ embeds: [embed.toDiscordEmbed()] })
		.then(msg => setTimeout(() => msg.delete(), 60000));
};

const petWarning = (user: User, hp: number, ctx: DiscordMessageContext) => {
	const desc = `**${user}** your pet is at __**${hp}%**__ health!!!\n`;
	const footer = "Your pet is getting very weak, take care of it quickly!";
	const embed = new Embed()
		.setTitle(`${user.username} PET Health Warning!!! - ${hp}%__`)
		.setColor("#ff0000")
		.setDescription(desc)
		.setImage(senddeath)
		.setFooter({ text: footer });
	ctx.channel.send({ embeds: [embed.toDiscordEmbed()] })
		.then(msg => setTimeout(() => msg.delete(), 60000));
};

async function percentageCheck(
	user: User,
	ctx: DiscordMessageContext,
	player: number,
	pet: number
) {
	if (user.base.getSetting("healthmonitor") === "on") {
		const healthmonitor = user.base.getSetting("healthmonitor");
		const selection = user.base.getSetting("individualhealthmonitor");
		const percentage = !isNaN(Number(healthmonitor))
			? Number(healthmonitor)
			: 100;

		if (selection === "character" && player <= percentage) {
			return player <= 11
				? playerWarning(user, player, ctx)
				: general(user, player, pet, ctx);
		} else if (selection === "pet" && pet <= percentage) {
			return pet <= 11
				? petWarning(user, pet, ctx)
				: general(user, player, pet, ctx);
		} else if (player <= percentage && player <= 11) {
			return playerWarning(user, player, ctx);
		} else if (pet <= percentage && pet <= 11 && pet > 0) {
			return petWarning(user, pet, ctx);
		} else if (player <= percentage || pet <= percentage) {
			return general(user, player, pet, ctx);
		}
	}
	return false;
}

export default async (ctx: DiscordMessageContext) => {
	const healthmonitor = ctx.server?.base.getSetting("healthmonitor");
	if (
		(!healthmonitor && ctx.server)
		|| healthmonitor === "off"
		|| !ctx.interaction) return false;

	const user = await ctx.fetchUser(ctx.interaction.user.id);

	if (ctx.content.includes(") | +") && ctx.content.match(adv3Regex)) {
		const hpMatches = [...ctx.content.matchAll(adv3HealthRegex)];
		if (hpMatches) {
			const playerHP = Number(hpMatches[0][1]);
			const petHP = hpMatches[1] ? Number(hpMatches[1][1]) : 0;
			return percentageCheck(user, ctx, playerHP, petHP);
		}
	}

	const player = { hp: 0, maxHp: 0, name: "null" };
	const pet = { hp: 0, maxHp: 0 };

	if (ctx.embeds.length === 0 && ctx.content.includes(" Adventure ")) {
		const healthMessage = ctx.content.match(healthMessagePattern);
		if (healthMessage && ctx.content.match(namePattern)) {
			const nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
			const name = ctx.content.match(namePattern);
			if (nums && name) {
				player.name = name[1];
				player.hp = Number(nums[1].replace(/,/g, ""));
				player.maxHp = Number(nums[2].replace(/,/g, ""));
			}
		}

		const messageArray = ctx.content.split("\n");
		const dealtLine = messageArray.findIndex(l => l.includes(" dealt "));
		const tookLine = messageArray.findIndex(l => l.includes(" took "));
		if (tookLine === dealtLine + 1) {
			const petInfosLine = messageArray[tookLine + 1].split(" ");
			const currentHP = petInfosLine[petInfosLine.indexOf("has") + 1]
				.split("/")[0].replace(",", "");
			const maxHP = petInfosLine[petInfosLine.indexOf("has") + 1]
				.split("/")[1].replace(",", "");
			pet.hp = Number(currentHP);
			pet.maxHp = Number(maxHP);
		}
	} else if (ctx.embeds[0]?.author?.name.includes("Adventure")) {
		const adventureEmbed = ctx.embeds[0];
		const crit = adventureEmbed.fields[1].name === "Critical Hit!" ? 2 : 1;

		const petData = adventureEmbed.fields[crit].value.split("\n")[2];
		if (petData) {
			const split = petData.split(" ")[1].split("/");
			pet.hp = Number(split[0].replace(",", ""));
			pet.maxHp = Number(split[1].replace(",", ""));

			const { name, value } = adventureEmbed.fields[0];
			const healthLine = value.match(/Has ([\d,]+)\/([\d,]+) HP left/);
			if (healthLine) {
				player.name = name;
				player.hp = Number(healthLine[1].replace(/,/g, ""));
				player.maxHp = Number(healthLine[2].replace(/,/g, ""));
			}
		}
	}

	if (user.base.getSetting("healthmonitor") === "on" && player.hp) {
		const playerHP = Math.round((1000 * player.hp) / player.maxHp) / 10;
		const petHP = Math.round((10 * pet.hp * 100) / pet.maxHp) / 10;
		percentageCheck(user, ctx, playerHP, petHP);
	}

	return false;
};
