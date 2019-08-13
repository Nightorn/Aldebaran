const Discord = require("discord.js");

exports.run = async (client, guild) => {
	let mods = 0; let admins = 0; let
		bots = 0;
	for (const [, user] of guild.members) {
		if (user.permissions.has("ADMINISTRATOR") && !user.user.bot) admins++;
		if (user.permissions.has("MANAGE_MESSAGES") && !user.user.bot) mods++;
		if (user.user.bot) bots++;
	}
	const embed = new Discord.MessageEmbed()
		.setAuthor(`${guild.name}  |  ${guild.id}`, guild.iconURL())
		.addField("Owner Informations", `**User** : <@${guild.owner.user.id}> **\`[${guild.owner.user.tag}]\`**\n**ID** : ${guild.owner.user.id}`)
		.addField("Member Count", `**${guild.memberCount}** Members (with **${bots}** Bots)\n**${admins}** Admins and **${mods - admins}** Mods`)
		.setColor("GREEN")
		.setTimestamp()
		.setThumbnail(guild.iconURL());
	client.channels.get("463201092398874634").send(embed);
};
