const poolQuery = require('./../../functions/database/poolQuery');
const Discord = require("discord.js");
module.exports = function(client, message, args) {
  	poolQuery(`SELECT * FROM guilds WHERE guildid ='${message.guild.id}'`).then((result) => {
		if (result.length === 0) return;
		if (JSON.parse(result[0].settings).healthMonitor === 'off') return;
		
		var player = {
			name : null,
			currentHP : 0,
			maxHP : 0
		}, pet = {
			currentHP : 0,
			maxHP : 0
		};
		var deathimage = require(`./../../Data/imageurls.json`)
		var senddeath = (`${deathimage.deathimage[~~(Math.random() * deathimage.deathimage.length)]}`);
		if (message.embeds.length === 0) {
			if (message.content.indexOf("'s Adventure") != -1) {
				var healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
				var healthMessage = message.content.match(healthMessagePattern);
				if (healthMessage) {
					var nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
					player.currentHP = Number(nums[1].replace(/,/g,""));
					player.maxHP = Number(nums[2].replace(/,/g,""));
					player.name = message.content.split(`\n`)[1].replace("'s Adventure ]========!", "").replace("!========[ ", "");
				}
				const messageArray = message.content.split('\n');
				if (messageArray[3] != undefined) {
					const petInfosLine = messageArray[3].indexOf('+ Critical hit!') != -1 ? messageArray[8].split(' ') : messageArray[7].split(' ');
					pet.currentHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[0].replace(',', ''));
					pet.maxHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[1].replace(',', ''));
				}
			}
		}
		else {
			if (message.embeds[0].author != undefined) {
				if (message.embeds[0].author.name.indexOf("Adventure") != -1) {
					const char_field = message.embeds[0].fields[1].name == "Critical Hit!" ? message.embeds[0].fields[4] : message.embeds[0].fields[3];
					player.currentHP = parseInt(char_field.value.split(' ')[1].split('/')[0].replace(',', ''));
					player.maxHP = parseInt(char_field.value.split(' ')[1].split('/')[1].replace(',', ''));

					const pet_field = message.embeds[0].fields[1].name == "Critical Hit!" ? message.embeds[0].fields[3] : message.embeds[0].fields[2];
					pet.currentHP = parseInt(pet_field.value.split(' ')[1].split('/')[0].replace(',', ''));
					pet.maxHP = parseInt(pet_field.value.split(' ')[1].split('/')[1].replace(',', ''));

					player.name = char_field.name;
				}
			}
		}
      
		const user = client.users.find('username', player.name);
		player.healthPercent = Math.round(10 * player.currentHP * 100 / player.maxHP) / 10;
		pet.healthPercent = Math.round(10 * pet.currentHP * 100 / pet.maxHP) / 10;
		if (user != null && player.name != undefined && player.healthPercent != pet.healthPercent) {
			const execute = (individual, healthMonitor) => {
				const playerWarning = () => {
					const embed = new Discord.RichEmbed()
					  	.setTitle(`__${user.username} Health Warning!!! - ${player.healthPercent}%__`)
						.setColor(0xff0000)
						.setDescription(`**${user.username}** is at __**${player.currentHP}**__ health!!!\n`)
						.setImage(`${senddeath}`)
						.setFooter(`You are going to die aren't you?`)
					message.channel.send(embed).then(msg => msg.delete(60000));
				}, petWarning = () => {
					const embed = new Discord.RichEmbed()
						.setTitle(`__${user.username} PET Health Warning!!! - ${pet.healthPercent}%__`)
						.setColor(0xff0000)
						.setDescription(`**${user.username}** your pet is at __**${pet.currentHP}**__ health!!!\n`)
						.setImage(`${senddeath}`)
						.setFooter(`OMG YOUR GOING TO LET YOUR PET DIE????`)
				  message.channel.send(embed).then(msg => msg.delete(60000));
				}, general = () => {
					var embed = new Discord.RichEmbed()
					 	.setAuthor(user.username, user.avatarURL)
					 	.addField(`__Character Health__ - **${player.healthPercent}%**`,`(${player.currentHP} HP / ${player.maxHP} HP)`, false)
					 	.setFooter(`&config To Change Health Monitor Settings`)
	  
					if (player.healthPercent <= 20 || pet.healthPercent <= 20) embed.setColor('RED');
					else if (player.healthPercent <= 40 || pet.healthPercent <= 40) embed.setColor('ORANGE');
					else if (player.healthPercent <= 60 || pet.healthPercent <= 60) embed.setColor('GOLD');
					else if (player.healthPercent <= 100 || pet.healthPercent <= 100) embed.setColor('GREEN');
					if (!isNaN(pet.healthPercent)) embed.addField(`__Pet Health__ - **${pet.healthPercent}%**`, `(${pet.currentHP} HP / ${pet.maxHP} HP)`, false);
					message.channel.send({embed}).then(msg => msg.delete(30000));
				}

				if (['character', "pet"].indexOf(individual) !== -1) {
					if (individual === 'character' && player.healthPercent < 11 && (player.healthPercent <= healthMonitor || healthMonitor === 'on')) return playerWarning();
					if (individual === 'pet' && pet.healthPercent < 11 && (pet.healthPercent <= healthMonitor || healthMonitor === 'on')) return petWarning();
					if (player.healthPercent <= healthMonitor || pet.healthPercent <= healthMonitor || healthMonitor === 'on') return general();
				} else {
					if (player.healthPercent < 11 && (player.healthPercent <= healthMonitor || healthMonitor === 'on')) return playerWarning();
					else if (pet.healthPercent < 11 && (pet.healthPercent <= healthMonitor || healthMonitor === 'on')) return petWarning();
					else if (player.healthPercent <= healthMonitor || pet.healthPercent <= healthMonitor || healthMonitor === 'on') return general();
				}
			}

			poolQuery(`SELECT * FROM users WHERE userId='${user.id}'`).then((result) => {
				if (result[0] !== undefined) {
					if (JSON.parse(result[0].settings).healthMonitor === 'off') return;
					execute(JSON.parse(result[0].settings).individualHealthMonitor, JSON.parse(result[0].settings).healthMonitor);
				}
			});
		}
  	});
}