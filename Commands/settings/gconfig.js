const { MessageEmbed } = require('discord.js');
exports.run = async function(bot, message, args) {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`How about you not do that!`);
    const parametersAvailable = bot.models.settings.guild;
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to set the experience and the limitations of the members of your server.\n**Usage Example:** \`&gconfig adventureTimer off\`.\n__Note:__ This command can only be used by the owner of the server.\n${description}`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
            if (parametersAvailable[args[0]].support(args[1])) {
                if (!message.guild.existsInDb) await message.guild.create();
                message.guild.changeSetting(args[0], args[1]).then(() => {
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
                message.channel.send(`**Error** This value is not supported, check \`&gconfig help\` for more informations.`);
            }
        } else {
            message.channel.send(`**Error** This key does not exist, check \`&gconfig help\` for more informations.`);
        }
    }
}
exports.infos = {
    category: "Settings",
    description: "Used to enabled or disable features of aldebaran.",
    usage: "\`&gconfig <parameter> <setting>\`",
    example: "\`&gconfig adventureTimer on\`",
    restrictions: "Server Owner"
}
