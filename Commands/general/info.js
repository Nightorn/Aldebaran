const Discord = require('discord.js');
const admins = require(`${process.cwd()}/config.json`).admins;
exports.run = function(bot, message, args) {
    const minutesUptime = `${String(Math.floor(bot.uptime%3600000/60000))}m`;
    let adminMentions = "";
    admins.forEach((val, index) => {
       adminMentions = adminMentions.concat(`${index==0?'':','}<@${val}>`);
    });
    const embed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Details About Aldebaran Bot')
        .addField(`__Developers__`, `<@310296184436817930>\n<@320933389513523220>\n<@143026985763864576>`, true)
        .addField(`__Prefix__`, `**&**`, true)
        .addField(`__Statistics__`, `**Servers** : ${bot.guilds.size}\n**Channels** : ${bot.channels.size}\n**Users** : ${bot.users.size}`, true)
        .addField(`__Resources__`, `**Memory Usage** : ${Math.round(100 * process.memoryUsage().heapTotal/1000000) / 100} MB\n**Uptime** : ${Math.floor(bot.uptime/3600000)}h${minutesUptime.length == 2 ? '0' + minutesUptime : minutesUptime}`, true)
        .addField(`__Language__`,`JavaScript`,true)
        .addField(`__Hosted On__`, `**Heroku**: *Application Host*\n**Github**: *Code Host*\n**ClearDB**: *Database Host*`, true)
        .setThumbnail(message.guild.iconURL)
        .setColor(`GREEN`);
    message.channel.send({embed: embed});
}
exports.infos = {
    category: "General",
    description: "Displays Into About Aldebaran",
    usage: "\`&info\`",
    example: "\`&info\`"
}
