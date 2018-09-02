const { MessageEmbed } = require("discord.js");
exports.run = async function(bot, message, args) {
    const parametersAvailable = bot.models.settings.user;
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to have a better experience of ${bot.user.username}\n(Note: If setting is disabled in &gconfig by guild owner, these settings will be ignored.\n**__Usage Example__** : \`&uconfig healthMonitor off\`\n${description}\n`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
            if (parametersAvailable[args[0]].support(args[1])) {
                if (!message.author.existsInDb) await message.author.create();
                message.author.changeSetting(args[0], args[1]).then(() => {
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle(`Settings successfully changed`)
                        .setDescription(`The property **${args[0]}** has successfully been changed to the value **${args[1]}**.`)
                        .setColor(`GREEN`);
                    message.channel.send({embed});
                }).catch(err => {
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle(`An Error Occured`)
                        .setDescription(`An error occured and we could not change your settings. Please retry later.`)
                        .setColor(`RED`);
                    message.channel.send({embed});
                    throw err;
                });
            } else {
                message.channel.send({embed: {color: 0xff0000, title: "Not supported", description: "This value is not vaild. Please check \`&uconfig help\` for the vaild values for this setting."}});
            }
        } else {
            message.channel.send({embed: {color: 0xff0000, title: "Invaild key", description: "This key does not exist. Check \`&uconfig help\` for the keys accepted.."}});
        }
    }
}
exports.infos = {
    category: "Settings",
    description: "Changes User Configurations For Aldebaran Features",
    usage: "\`&uconfig <parameter> <setting>\`",
    example: "\`&uconfig adventureTimer on\`",
}