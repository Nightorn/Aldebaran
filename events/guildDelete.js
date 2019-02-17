const Discord = require(`discord.js`)
exports.run = async (client, guild) => {
	const embed = new Discord.MessageEmbed()
		.setAuthor(`${guild.name}  |  ${guild.id}`, guild.iconURL())
  		.addField(`Owner Informations`, `**User** : <@${guild.owner.user.id}> **\`[${guild.owner.user.tag}]\`**\n**ID** : ${guild.owner.user.id}`)
  		.setColor('RED')
  		.setTimestamp()
  		.setThumbnail(guild.iconURL())
  	client.channels.get(`463201092398874634`).send(embed);
}   