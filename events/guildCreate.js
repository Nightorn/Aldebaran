const Discord = require(`discord.js`)
exports.run = async (client, guild) => {
  const embed = new Discord.RichEmbed()
  .setAuthor(client.user.username, client.user.avatarURL)
  .setTitle(`Has Joined A New Guild!`)
  .setColor('GREEN')
  .addField(`__**Server Name**__`,guild.name,true)
  .addField(`__**Owned By**__`,`**Name:** ${guild.owner}\n**ID**: ${guild.ownerID}`,true)
  .addField(`__**Member Count**__`,guild.memberCount,false)
  .addField(`__**Server ID**__`,guild.id,true)
  .addField(`__**Large Guild?**__`,guild.large,true)
  .setFooter(`Added On ${guild.joinedAt}`)
  .setThumbnail(guild.iconURL)
  client.channels.get(`463201092398874634`).send(embed);
}   