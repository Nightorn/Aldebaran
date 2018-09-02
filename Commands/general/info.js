const { MessageEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    let adminMentions = "";
    for (let id of bot.config.admins) adminMentions += `<@${id}>\n`;
    const minutesUptime = `${String(Math.floor(bot.uptime%3600000/60000))}m`;
    const embed = new MessageEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL())
        .setTitle('Details About Aldebaran Bot')
        .addField(`__Developers__`, `${adminMentions}`, true)
        .addField(`__Statistics__`, `**Servers** : ${bot.guilds.size}\n**Channels** : ${bot.channels.size}\n**Users** : ${bot.users.size}`, true)
        .addField(`__Resources__`, `**Memory Usage** : ${Math.round(100 * process.memoryUsage().heapTotal/1000000) / 100} MB\n**Uptime** : ${Math.floor(bot.uptime/3600000)}h${minutesUptime.length == 2 ? '0' + minutesUptime : minutesUptime}`, true)
        .addField(`__Powered By__`, `**DigitalOcean** : VPS Host\n**Node.JS** : JavaScript Runtime`, true)
        .setFooter(`The prefix in this guild is "${message.guild.prefix}".`)
        .setThumbnail(message.guild.iconURL())
        .setColor(`GREEN`);
    message.channel.send({embed: embed});
}
exports.infos = {
    category: "General",
    description: "Displays Into About Aldebaran",
    usage: "\`&info\`",
    example: "\`&info\`"
}
