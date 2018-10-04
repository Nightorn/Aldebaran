exports.run = (bot, message, args) => {
	const { MessageEmbed } = require('discord.js');
	require(`${process.cwd()}/functions/action/userCheck`)(bot, message, args).then(usrid => {
		const user = bot.users.fetch(usrid);
		const embed = new MessageEmbed()
			.setAuthor(user.username, user.avatarURL())
			.setTitle(`${user.username}'s Avatar`)
			.setImage(user.avatarURL({ size: 2048 }));
		message.channel.send({embed});
	}).catch(() => {
        message.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
	});
}

exports.infos = {
      category: "General",
      description: "Displays Mentioned Users Avatar Image.",
      usage: "\`&avatar <usermention>\`",
      example: "\`&avatar @aldebaran\`"
  }
        
