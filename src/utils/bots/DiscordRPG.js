/* eslint consistent-return: off */
/* eslint no-else-return: off */
const { MessageEmbed } = require("discord.js");
const { deathimage } = require("../../../assets/data/imageurls.json");

const senddeath = deathimage[Math.floor(Math.random() * deathimage.length)];

const embedColor = playerPercentage => {
	if (playerPercentage <= 20) return "RED";
};

const emojiColor = percentage => {
	if (percentage <= 20) return "<:red:610021415919288320>";
	if (percentage <= 40) return "<:orange:610021415973814291>";
	if (percentage <= 60) return "<:yellow:610021415487537163>";
	return "<:green:610021415755972628>";
};

const checkPlayer = (message, username) => {
	const matchedMessage = message.channel.messages.cache.find(
		msg => msg.author.username === username
	);
	const matchedAdventure = message.channel.drpgRecentADVs.get(username);
	if (matchedMessage !== undefined) return matchedMessage.author;
	if (matchedAdventure !== undefined) return matchedAdventure.user;
	return null;
};

const general = (user, playerHP, petHP, message) => {
	const { healthMonitor, individualHealthMonitor } = user.settings;
	if (user === null) return;
	if (healthMonitor !== undefined && healthMonitor !== "off") {
		const embed = new MessageEmbed()
			.setAuthor(user.username, user.avatarURL())
			.setColor(embedColor(playerHP));
		if (["character", "pet"].indexOf(individualHealthMonitor) !== -1) {
			embed.addField(
				...(individualHealthMonitor === "character"
					? ["__Character Health__", `${emojiColor(playerHP)} **${playerHP}%**`]
					: ["__Pet Health__", petHP === 0 ? "**DEAD**" : `${emojiColor(petHP)} **${petHP}**%`]),
				true
			);
		} else {
			embed.addField("__Character Health__", `${emojiColor(playerHP)} **${playerHP}%**`, true);
			embed.addField(
				"__Pet Health__",
				petHP === "Dead" ? "**DEAD**" : `${emojiColor(petHP)} **${petHP}%**`,
				true
			);
		}
		message.channel.send({ embed });
	}
};

const playerWarning = (user, hp, message) => {
	const embed = new MessageEmbed()
		.setTitle(`__${user.username} Health Warning!!! - ${hp}%__`)
		.setColor(0xff0000)
		.setDescription(`**${user.username}** is at __**${hp}%**__ health!!!\n`)
		.setImage(senddeath)
		.setFooter("Pay attention to your health or you are going to die!");
	message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
};

const petWarning = (user, hp, message) => {
	const embed = new MessageEmbed()
		.setTitle(`${user.username} PET Health Warning!!! - ${hp}%__`)
		.setColor(0xff0000)
		.setDescription(
			`**${user.username}** your pet is at __**${hp}%**__ health!!!\n`
		)
		.setImage(senddeath)
		.setFooter("Your pet is getting very weak, take care of it quickly!");
	message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
};

const percentageCheck = (name, msg, player, pet) => {
	const user = checkPlayer(msg, name);
	if (user !== null) {
		const { healthMonitor, individualHealthMonitor } = user.settings;
		const percentage = !Number.isNaN(parseInt(healthMonitor, 10))
			? parseInt(healthMonitor, 10)
			: 100;
		if (healthMonitor === undefined || healthMonitor === "off") return false;
		if (["character", "pet"].indexOf(individualHealthMonitor) !== -1) {
			if (individualHealthMonitor === "character") {
				if (player <= percentage) {
					if (player <= 11) return playerWarning(user, player, msg);
					return general(user, player, pet, msg);
				}
			} else if (pet <= percentage) {
				if (pet <= 11) return petWarning(user, pet, msg);
				return general(user, player, pet, msg);
			}
		} else if (player <= percentage || pet <= percentage) {
			if (player <= 11) return playerWarning(user, player, msg);
			if (pet <= 11 && pet !== 0) return petWarning(user, pet, msg);
			return general(user, player, pet, msg);
		}
	}
};

module.exports = (client, message) => {
	if (message.guild.settings.healthmonitor === "off") return;
	const player = {
		name: null,
		currentHP: 0,
		maxHP: 0
	};
	const pet = {
		currentHP: 0,
		maxHP: 0
	};
	if (message.embeds.length === 0) {
		if (message.content.includes("'s Adventure") || message.content.includes("Party Adventure")) {
			if (message.content.indexOf(") | +") !== -1) {
				player.name = message.content.match(/Rolled a \d\n[+-] (.*): *[\d.]+% HP/);
				if (player.name !== null) player.name = player.name[1];
				// eslint-disable-next-line no-useless-escape
				const hpMatches = message.content.match(/(Dead|[\d\.]+% HP)/g);
				const deadPet = hpMatches[1] === "Dead";
				// eslint-disable-next-line no-param-reassign
				message.content = message.content.replace(/%/g, "");
				return percentageCheck(
					player.name,
					message,
					parseInt(hpMatches[0].split(" ")[0], 10),
					deadPet ? 0 : parseInt(hpMatches[1].split(" ")[0], 10)
				);
			} else {
				const healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
				const healthMessage = message.content.match(healthMessagePattern);
				if (healthMessage) {
					const nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
					player.currentHP = Number(nums[1].replace(/,/g, ""));
					player.maxHP = Number(nums[2].replace(/,/g, ""));
					player.name = message.content.match(/\+ (.*) has [\d,]+\/[\d,]+ HP left\./)[1];
				}
				const messageArray = message.content.split("\n");
				let dealtLine = null;
				let tookLine = null;
				for (const i in messageArray) {
					if (messageArray[i].indexOf(" dealt ") !== -1) { dealtLine = parseInt(i, 10); }
					if (messageArray[i].indexOf(" took ") !== -1) { tookLine = parseInt(i, 10); }
				}
				if (tookLine === dealtLine + 1) {
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
		}
	} else if (
		message.embeds[0].author !== undefined
		&& message.embeds[0].author !== null
	) {
		const adventureEmbed = message.embeds[0];
		if (message.embeds[0].author.name.includes("Adventure")) {
			const petData = adventureEmbed.fields[
				adventureEmbed.fields[1].name === "Critical Hit!" ? 2 : 1
			].value.split("\n")[2];
			if (petData) {
				player.name = adventureEmbed.fields[0].name;
				[pet.currentHP, pet.maxHP] = petData.split(" ")[1].split("/");
				const healthLine = adventureEmbed.fields[0].value.match(/Has ([\d,]+)\/([\d,]+) HP left/);
				player.currentHP = Number(healthLine[1].replace(/,/g, ""));
				player.maxHP = Number(healthLine[2].replace(/,/g, ""));
				pet.currentHP = parseInt(pet.currentHP.replace(",", ""), 10);
				pet.maxHP = parseInt(pet.maxHP.replace(",", ""), 10);
			}
		}
	}

	const user = checkPlayer(message, player.name);
	if (user === null) return;
	player.healthPercent = Math
		.round((1000 * player.currentHP) / player.maxHP) / 10;
	pet.healthPercent = Math.round((10 * pet.currentHP * 100) / pet.maxHP) / 10;
	if (
		user !== undefined
    && player.name !== undefined
    && player.healthPercent !== pet.healthPercent
	) {
		if (user.settings.healthmonitor === "off") return;

		percentageCheck(
			player.name,
			message,
			player.healthPercent,
			pet.healthPercent
		);
	}
};
