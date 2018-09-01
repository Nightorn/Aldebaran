const AldebaranClient = require(`${process.cwd()}/structures/Discord/Client.js`);
const { MessageEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    const embed = new MessageEmbed()
        .setTitle(`Restarting ${bot.user.username}`)
        .setDescription(`Restarting the bot, depending on the bot size, this should take a while.`)
        .setColor('ORANGE');
    message.channel.send({embed}).then(msg => {
        bot.destroy();
        bot = new AldebaranClient();
    });
}

exports.infos = {
    category: "Developer",
    description: "Preforms restart on Aldebaran",
    usage: "\`&restart\`",
    example: "\`&restart\`",
    restrictions: "Developer Only"
}