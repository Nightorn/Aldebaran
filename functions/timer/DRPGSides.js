const config = require('./../../config.json');
const Discord = require("discord.js");
const poolQuery = require('./../../functions/database/poolQuery');
module.exports = async function(bot, message, args) {
    if (message.content.toLowerCase().startsWith(`#!mine`)|| message.content.toLowerCase().startsWith(`,mine`)|| message.content.toLowerCase().startsWith(`.mine`)){
		const emoji = ["🥕","🍋","🥔","🐟"]
		var randomemoji = (`${emoji[~~(Math.random() * emoji.length)]}`);  
		poolQuery(`SELECT * FROM guilds WHERE guildid ='${message.guild.id}'`).then((result) =>{
        	if (Object.keys(result).length != 0) {
          		let settingsg = JSON.parse(result[0].settings);
          		if (settingsg.sidesTimer === `on`){
            		poolQuery(`SELECT * FROM users WHERE userId='${message.author.id}'`).then((result) => {
						if (settingsg.autoDelete !== `off`)message.delete(500);
          				if (Object.keys(result).length != 0) {
            				let settings = JSON.parse(result[0].settings);
            				if (settings.sidesTimer === `on`) {
								const embed3 = new Discord.RichEmbed()
									.setAuthor(message.author.username, message.author.avatarURL)
									.setColor(0x00AE86)
									.setDescription(`React with 🚫 to cancel timer.`)
								message.channel.send(embed3).then(mesg => {
									mesg.react("🚫");
									mesg.awaitReactions((reaction, user) => reaction.emoji.name === "🚫" && user.id == message.author.id, {time: 5000, max: 1}).then(reactions => {
										mesg.delete(5000);
										if (reactions.get("🚫") == undefined) {
										  	const embed = new Discord.RichEmbed()
											  	.setDescription(`Your sides timer has been set!`)
											  	.setAuthor(message.author.username, message.author.avatarURL)
											  	.setColor(0x00AE86);
										  	message.channel.send({embed}).then(timerset => {
												timerset.delete(5000)
												setTimeout((channel, userid) => {
												  	message.channel.send(`<@${message.author.id}> sides time! ${randomemoji}`).then(msg => {
														msg.delete(180000)
												  	}).catch();
												}, 312500, message.channel, message.author.id);
										  	});
										} else {
										  	const embed1 = new Discord.RichEmbed()
											  	.setDescription(`Timer Canceled`)
											  	.setAuthor(`${message.author.username}`)
											  	.setColor(`Red`)
										  	message.channel.send(embed1).then(timernotset => {
												timernotset.delete(5000);
											});
										}
									});
								});
            				}
          				}
        			}).catch();  
      			}
    		}
  		})
  	}
}     
