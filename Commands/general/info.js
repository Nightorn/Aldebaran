const { MessageEmbed } = require('discord.js');
const config = require(`./../../config.json`)
exports.run = function(bot, message, args) {
    let adminMentions = "";
    for (let id of bot.config.admins) adminMentions += `<@${id}>\n`;
    const minutesUptime = `${String(Math.floor(bot.uptime%3600000/60000))}m`;
    const embed = new MessageEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL())
        .setTitle(`Version ${bot.version}`)
        .addField(`__Developers__`, `${adminMentions}`, true)
        .addField(`__Statistics__`, `**Servers** : ${bot.guilds.size}\n**Channels** : ${bot.channels.size}\n**Users** : ${bot.users.size}`, true)
        .addField(`__Resources__`, `**Memory Usage** : ${Math.round(100 * process.memoryUsage().heapTotal/1000000) / 100} MB\n**Uptime** : ${Math.floor(bot.uptime/3600000)}h${minutesUptime.length == 2 ? '0' + minutesUptime : minutesUptime}`, true)
        .addField(`__Powered By__`, `**DigitalOcean** : VPS Host\n**Node.JS** : JavaScript Runtime`, true)
        .addField(`__Note__`, `Please note that ${bot.user.username} is not directly related to DiscordRPG. If you have any question, suggestion or bug report that concerns Aldebaran and not DiscordRPG, please join [our server](https://discord.gg/3x6rXAv) or use \`&suggest\` and \`&bugreport\`.`)
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
