const Discord = require(`discord.js`)
exports.run = async (client, guild) => {
  const embed = new Discord.MessageEmbed()
  .setAuthor(client.user.username, client.user.avatarURL())
  .setTitle(`Has Left A Guild!`)
  .setColor('RED')
  .addField(`__**Server Name**__`,guild.name,true)
  .addField(`__**Owned By**__`,`**Name:** ${guild.owner}\n**ID**: ${guild.ownerID}`,true)
  .addField(`__**Member Count**__`,guild.memberCount,false)
  .addField(`__**Server ID**__`,guild.id,true)
  .addField(`__**Large Guild?**__`,guild.large,true)
  .setTimestamp()
  .setThumbnail(guild.iconURL())
  client.channels.get(`463201092398874634`).send(embed);
}   