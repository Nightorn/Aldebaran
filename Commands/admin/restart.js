
exports.run = function(bot, message, args) {
    if (['310296184436817930', '320933389513523220', '143026985763864576'].indexOf(message.author.id) === -1) {message.channel.send({embed: {
        title: ":x: NOU",
        description: "You are not an Aldebaran developer. You are not allowed to do that.",
        color: 0xff0000
    }}); return;} 
    const Discord = require('discord.js');
    const config = require(`${process.cwd()}/config.json`);
    const embed = new Discord.RichEmbed()
        .setTitle(`Restarting ${bot.user.username}`)
        .setDescription(`Please wait, this may take up to 15 seconds.`)
        .setColor('ORANGE');
    message.channel.send({embed}).then(msg => {
        bot.destroy().then(() => {
            bot.login(config.token).then(() => {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Restarting ${bot.user.username}`)
                    .setDescription(`Successfully restarted the bot.`)
                    .setColor('GREEN');
                msg.delete();
                message.channel.send(embed);
            })
        }).catch(err => {
            const embed = new Discord.RichEmbed()
                .setTitle(`Restarting ${bot.user.username}`)
                .setDescription(`An unknown error occured.`)
                .setColor('RED');
            msg.delete();
            message.channel.send(embed);
        })
    })
}

exports.infos = {
    category: "Developer",
    description: "Preforms restart on Aldebaran",
    usage: "\`&restart\`",
    example: "\`&restart\`",
    restrictions: "Developer Only"
}
